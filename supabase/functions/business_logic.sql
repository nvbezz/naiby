-- ============================================================
-- business_logic.sql — Funciones principales de negocio
-- ============================================================

-- ============================================================
-- registrar_venta
-- Inserta venta + venta_items y descuenta stock en una sola transacción.
-- p_items: [{"producto_id": "uuid", "cantidad": int, "precio_unitario": numeric}]
-- Retorna: id de la venta creada
-- ============================================================
create or replace function registrar_venta(
  p_negocio_id   uuid,
  p_cliente_id   uuid,
  p_items        json,
  p_metodo_pago  text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_venta_id  uuid;
  v_total     numeric(12,2) := 0;
  v_item      json;
  v_cantidad  integer;
  v_precio    numeric(12,2);
  v_prod_id   uuid;
  v_stock     integer;
begin
  -- Calcular total y validar stock
  for v_item in select * from json_array_elements(p_items) loop
    v_prod_id  := (v_item->>'producto_id')::uuid;
    v_cantidad := (v_item->>'cantidad')::integer;
    v_precio   := (v_item->>'precio_unitario')::numeric;

    select stock into v_stock
    from public.productos
    where id = v_prod_id and negocio_id = p_negocio_id;

    if not found then
      raise exception 'Producto % no encontrado en el negocio', v_prod_id;
    end if;

    if v_stock < v_cantidad then
      raise exception 'Stock insuficiente para el producto %', v_prod_id;
    end if;

    v_total := v_total + (v_precio * v_cantidad);
  end loop;

  -- Insertar venta
  insert into public.ventas (negocio_id, cliente_id, metodo_pago, total)
  values (p_negocio_id, p_cliente_id, p_metodo_pago, v_total)
  returning id into v_venta_id;

  -- Insertar items y descontar stock
  for v_item in select * from json_array_elements(p_items) loop
    v_prod_id  := (v_item->>'producto_id')::uuid;
    v_cantidad := (v_item->>'cantidad')::integer;
    v_precio   := (v_item->>'precio_unitario')::numeric;

    insert into public.venta_items (venta_id, producto_id, cantidad, precio_unitario)
    values (v_venta_id, v_prod_id, v_cantidad, v_precio);

    update public.productos
    set stock = stock - v_cantidad
    where id = v_prod_id;
  end loop;

  -- Actualizar saldo_deuda del cliente si es fiado
  if p_metodo_pago = 'fiado' and p_cliente_id is not null then
    update public.clientes
    set saldo_deuda = saldo_deuda + v_total
    where id = p_cliente_id;

    insert into public.fiados (cliente_id, negocio_id, monto)
    values (p_cliente_id, p_negocio_id, v_total);
  end if;

  return v_venta_id;
end;
$$;

-- ============================================================
-- get_dashboard_stats
-- Retorna métricas del día actual para el negocio.
-- ============================================================
create or replace function get_dashboard_stats(p_negocio_id uuid)
returns table (
  ventas_hoy            bigint,
  ingresos_hoy          numeric,
  ticket_promedio       numeric,
  productos_stock_bajo  bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select
    (
      select count(*)::bigint
      from public.ventas
      where negocio_id = p_negocio_id
        and created_at >= current_date
    ) as ventas_hoy,
    (
      select coalesce(sum(total), 0)
      from public.ventas
      where negocio_id = p_negocio_id
        and created_at >= current_date
    ) as ingresos_hoy,
    (
      select coalesce(avg(total), 0)
      from public.ventas
      where negocio_id = p_negocio_id
        and created_at >= current_date
    ) as ticket_promedio,
    (
      select count(*)::bigint
      from public.productos
      where negocio_id = p_negocio_id
        and activo = true
        and stock <= stock_minimo
    ) as productos_stock_bajo;
end;
$$;

-- ============================================================
-- get_ventas_semana
-- Retorna ventas agrupadas por día de los últimos 7 días.
-- ============================================================
create or replace function get_ventas_semana(p_negocio_id uuid)
returns table (
  dia       date,
  total     numeric,
  cantidad  bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select
    created_at::date                   as dia,
    coalesce(sum(v.total), 0)          as total,
    count(*)::bigint                   as cantidad
  from public.ventas v
  where v.negocio_id = p_negocio_id
    and v.created_at >= current_date - interval '6 days'
  group by created_at::date
  order by dia asc;
end;
$$;
