-- ============================================================
-- 0001_initial_schema.sql
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Helper: trigger updated_at automático
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- USUARIOS (espejo de auth.users)
-- ============================================================
create table public.usuarios (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  nombre      text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger usuarios_updated_at
  before update on public.usuarios
  for each row execute procedure handle_updated_at();

-- Sync con auth.users al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.usuarios (id, email, nombre)
  values (new.id, new.email, new.raw_user_meta_data->>'nombre');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

alter table public.usuarios enable row level security;

create policy "usuarios: solo el propio usuario"
  on public.usuarios for all
  using (auth.uid() = id);

-- ============================================================
-- NEGOCIOS
-- ============================================================
create table public.negocios (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references public.usuarios(id) on delete cascade,
  nombre        text not null,
  pais          text not null default 'CO',
  moneda        text not null default 'COP',
  tipo_negocio  text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger negocios_updated_at
  before update on public.negocios
  for each row execute procedure handle_updated_at();

alter table public.negocios enable row level security;

create policy "negocios: owner"
  on public.negocios for all
  using (auth.uid() = owner_id);

-- ============================================================
-- CLIENTES
-- ============================================================
create table public.clientes (
  id           uuid primary key default uuid_generate_v4(),
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  nombre       text not null,
  telefono     text,
  saldo_deuda  numeric(12,2) not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger clientes_updated_at
  before update on public.clientes
  for each row execute procedure handle_updated_at();

alter table public.clientes enable row level security;

create policy "clientes: por negocio"
  on public.clientes for all
  using (
    negocio_id in (
      select id from public.negocios where owner_id = auth.uid()
    )
  );

-- ============================================================
-- PRODUCTOS
-- ============================================================
create table public.productos (
  id            uuid primary key default uuid_generate_v4(),
  negocio_id    uuid not null references public.negocios(id) on delete cascade,
  nombre        text not null,
  sku           text,
  categoria     text,
  stock         integer not null default 0,
  stock_minimo  integer not null default 5,
  precio_venta  numeric(12,2) not null,
  precio_costo  numeric(12,2) not null default 0,
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger productos_updated_at
  before update on public.productos
  for each row execute procedure handle_updated_at();

alter table public.productos enable row level security;

create policy "productos: por negocio"
  on public.productos for all
  using (
    negocio_id in (
      select id from public.negocios where owner_id = auth.uid()
    )
  );

-- ============================================================
-- VENTAS
-- ============================================================
create table public.ventas (
  id           uuid primary key default uuid_generate_v4(),
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  cliente_id   uuid references public.clientes(id) on delete set null,
  metodo_pago  text not null default 'efectivo',
  total        numeric(12,2) not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger ventas_updated_at
  before update on public.ventas
  for each row execute procedure handle_updated_at();

alter table public.ventas enable row level security;

create policy "ventas: por negocio"
  on public.ventas for all
  using (
    negocio_id in (
      select id from public.negocios where owner_id = auth.uid()
    )
  );

-- ============================================================
-- VENTA_ITEMS
-- ============================================================
create table public.venta_items (
  id               uuid primary key default uuid_generate_v4(),
  venta_id         uuid not null references public.ventas(id) on delete cascade,
  producto_id      uuid not null references public.productos(id) on delete restrict,
  cantidad         integer not null,
  precio_unitario  numeric(12,2) not null,
  created_at       timestamptz not null default now()
);

alter table public.venta_items enable row level security;

create policy "venta_items: por negocio via venta"
  on public.venta_items for all
  using (
    venta_id in (
      select v.id from public.ventas v
      join public.negocios n on n.id = v.negocio_id
      where n.owner_id = auth.uid()
    )
  );

-- ============================================================
-- FIADOS
-- ============================================================
create table public.fiados (
  id           uuid primary key default uuid_generate_v4(),
  cliente_id   uuid not null references public.clientes(id) on delete cascade,
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  monto        numeric(12,2) not null,
  pagado       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger fiados_updated_at
  before update on public.fiados
  for each row execute procedure handle_updated_at();

alter table public.fiados enable row level security;

create policy "fiados: por negocio"
  on public.fiados for all
  using (
    negocio_id in (
      select id from public.negocios where owner_id = auth.uid()
    )
  );

-- ============================================================
-- GASTOS
-- ============================================================
create table public.gastos (
  id           uuid primary key default uuid_generate_v4(),
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  descripcion  text not null,
  categoria    text,
  monto        numeric(12,2) not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger gastos_updated_at
  before update on public.gastos
  for each row execute procedure handle_updated_at();

alter table public.gastos enable row level security;

create policy "gastos: por negocio"
  on public.gastos for all
  using (
    negocio_id in (
      select id from public.negocios where owner_id = auth.uid()
    )
  );
