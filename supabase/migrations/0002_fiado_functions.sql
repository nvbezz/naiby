-- Marca un fiado como pagado y descuenta del saldo del cliente
create or replace function pagar_fiado(
  p_fiado_id uuid,
  p_negocio_id uuid
) returns void language plpgsql security definer as $$
declare
  v_monto numeric(12,2);
  v_cliente_id uuid;
  v_pagado boolean;
begin
  select monto, cliente_id, pagado
  into v_monto, v_cliente_id, v_pagado
  from public.fiados
  where id = p_fiado_id and negocio_id = p_negocio_id;

  if not found then raise exception 'Fiado no encontrado'; end if;
  if v_pagado then raise exception 'Este fiado ya fue pagado'; end if;

  update public.fiados set pagado = true where id = p_fiado_id;
  update public.clientes
    set saldo_deuda = greatest(0, saldo_deuda - v_monto)
    where id = v_cliente_id;
end;
$$;

-- Registra un fiado manual (sin venta POS)
create or replace function registrar_fiado_manual(
  p_negocio_id uuid,
  p_cliente_id uuid,
  p_monto numeric
) returns uuid language plpgsql security definer as $$
declare
  v_fiado_id uuid;
begin
  insert into public.fiados (negocio_id, cliente_id, monto, pagado)
  values (p_negocio_id, p_cliente_id, p_monto, false)
  returning id into v_fiado_id;

  update public.clientes
    set saldo_deuda = saldo_deuda + p_monto
    where id = p_cliente_id;

  return v_fiado_id;
end;
$$;
