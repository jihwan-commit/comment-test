-- comment-test: 폴리모픽 앵커 댓글 스키마 (Supabase SQL Editor 에서 그대로 실행)
-- 댓글은 화면 요소가 아니라 "어느 앱의 어느 테이블(target_type) 어느 행(target_id) 어느 열(field_path)" 에 붙는다.

create table if not exists comment_thread (
  id           uuid primary key default gen_random_uuid(),
  target_type  varchar(50)  not null,            -- 앱 접두 포함. 예: GEULIM_SALES_ORDER, HR_EMPLOYEE
  target_id    varchar(100) not null,            -- 대상 행 PK. 앱마다 uuid/정수가 섞여 문자열로 받는다. FK 없음(폴리모픽)
  field_path   varchar(100) not null default '', -- 대상 열(DTO 키). '' = 행 전체. null 이면 unique 가 중복을 허용해 '' 로 고정
  resolved_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (target_type, target_id, field_path)
);
create index if not exists comment_thread_target_idx on comment_thread (target_type, target_id);

create table if not exists comment (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references comment_thread(id) on delete cascade,
  author_id       varchar(100) not null,  -- 각 앱의 사용자 id 그대로. FK 없음
  author_name     varchar(100),           -- 표시용 스냅샷(앱 간 user 테이블 공유 불가)
  body            text not null,
  value_snapshot  varchar(500),           -- 작성 시 셀 값. 현재값과 다르면 "변경됨" 표시
  deleted_at      timestamptz,            -- soft delete
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists comment_thread_id_idx on comment (thread_id);

-- updated_at 자동 갱신
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create or replace trigger comment_thread_updated_at before update on comment_thread for each row execute function set_updated_at();
create or replace trigger comment_updated_at        before update on comment        for each row execute function set_updated_at();

-- 시연용: RLS 끄고 anon 키로 전부 허용. 실 서비스 이관 시 백엔드가 소유하므로 여기선 권한 모델 없음.
alter table comment_thread disable row level security;
alter table comment        disable row level security;
