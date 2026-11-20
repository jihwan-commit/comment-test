-- 이미 schema.sql 을 적용한 프로젝트용. 새로 세팅하면 schema.sql 에 포함돼 있어 불필요.
alter table comment_thread add column if not exists context_id varchar(100);
create index if not exists comment_thread_context_idx on comment_thread (target_type, context_id);
