select
  'POLICY' as object_type,
  tablename as object_name,
  policyname as detail,
  cmd as action,
  coalesce(qual, '') as using_expression,
  coalesce(with_check, '') as with_check_expression
from pg_policies
where schemaname = 'public'
  and tablename in ('lists', 'items', 'quick_add_items')

union all

select
  'TABLE GRANT' as object_type,
  table_name as object_name,
  grantee as detail,
  privilege_type as action,
  '' as using_expression,
  '' as with_check_expression
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('lists', 'items', 'quick_add_items')
  and grantee in ('authenticated', 'anon')

union all

select
  'RLS' as object_type,
  tablename as object_name,
  case when rowsecurity then 'enabled' else 'disabled' end as detail,
  '' as action,
  '' as using_expression,
  '' as with_check_expression
from pg_tables
where schemaname = 'public'
  and tablename in ('lists', 'items', 'quick_add_items')

order by object_type, object_name, detail;

---

| object_type | object_name     | detail                          | action | using_expression                                         | with_check_expression                                    |
| ----------- | --------------- | ------------------------------- | ------ | -------------------------------------------------------- | -------------------------------------------------------- |
| POLICY      | items           | org members can create items    | INSERT |                                                          | ((org_id = current_org_id()) AND can_edit_current_org()) |
| POLICY      | items           | org members can delete items    | DELETE | ((org_id = current_org_id()) AND can_edit_current_org()) |                                                          |
| POLICY      | items           | org members can read items      | SELECT | (org_id = current_org_id())                              |                                                          |
| POLICY      | items           | org members can update items    | UPDATE | ((org_id = current_org_id()) AND can_edit_current_org()) | ((org_id = current_org_id()) AND can_edit_current_org()) |
| POLICY      | lists           | org admins can delete lists     | DELETE | ((org_id = current_org_id()) AND is_current_org_admin()) |                                                          |
| POLICY      | lists           | org members can create lists    | INSERT |                                                          | ((org_id = current_org_id()) AND can_edit_current_org()) |
| POLICY      | lists           | org members can read lists      | SELECT | (org_id = current_org_id())                              |                                                          |
| POLICY      | lists           | org members can update lists    | UPDATE | ((org_id = current_org_id()) AND can_edit_current_org()) | ((org_id = current_org_id()) AND can_edit_current_org()) |
| POLICY      | quick_add_items | users can create own quick adds | INSERT |                                                          | (user_id = current_user_id())                            |
| POLICY      | quick_add_items | users can delete own quick adds | DELETE | (user_id = current_user_id())                            |                                                          |
| POLICY      | quick_add_items | users can read own quick adds   | SELECT | (user_id = current_user_id())                            |                                                          |
| POLICY      | quick_add_items | users can update own quick adds | UPDATE | (user_id = current_user_id())                            | (user_id = current_user_id())                            |
| RLS         | items           | enabled                         |        |                                                          |                                                          |
| RLS         | lists           | enabled                         |        |                                                          |                                                          |
| RLS         | quick_add_items | enabled                         |        |                                                          |                                                          |
| TABLE GRANT | items           | authenticated                   | DELETE |                                                          |                                                          |
| TABLE GRANT | items           | authenticated                   | INSERT |                                                          |                                                          |
| TABLE GRANT | items           | authenticated                   | SELECT |                                                          |                                                          |
| TABLE GRANT | items           | authenticated                   | UPDATE |                                                          |                                                          |
| TABLE GRANT | lists           | authenticated                   | DELETE |                                                          |                                                          |
| TABLE GRANT | lists           | authenticated                   | INSERT |                                                          |                                                          |
| TABLE GRANT | lists           | authenticated                   | SELECT |                                                          |                                                          |
| TABLE GRANT | lists           | authenticated                   | UPDATE |                                                          |                                                          |
| TABLE GRANT | quick_add_items | authenticated                   | INSERT |                                                          |                                                          |
| TABLE GRANT | quick_add_items | authenticated                   | UPDATE |                                                          |                                                          |
| TABLE GRANT | quick_add_items | authenticated                   | SELECT |                                                          |                                                          |
| TABLE GRANT | quick_add_items | authenticated                   | DELETE |                                                          |                                                          |