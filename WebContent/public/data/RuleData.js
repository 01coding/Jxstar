RuleData = {
'app_role_fun':[
	{srcNodeId:"app_fun",destNodeId:"app_role_fun",layout:"/public/layout/layout_tree.js",whereSql:"",whereType:"",whereValue:""}
],
'app_role_user':[
	{srcNodeId:"sys_user",destNodeId:"app_role_user",layout:"/public/layout/layout_tree.js",whereSql:"user_id not in (select user_id from app_role_user where role_id = {FKEYID})",whereType:"",whereValue:""}
],
'bos_package_fun':[
	{srcNodeId:"sel_fun",destNodeId:"bos_package_fun",layout:"/public/layout/layout_tree.js",whereSql:"reg_type in ('main', 'treemain', 'selfun', 'result') and module_id not like '1010%'",whereType:"",whereValue:""}
],
'bos_package_use':[
	{srcNodeId:"bos_tenant",destNodeId:"bos_package_use",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'bos_var':[
	{srcNodeId:"bos_var",destNodeId:"bos_var",layout:"",whereSql:"bos_tenant_id = 'jxstar'",whereType:"",whereValue:""}
],
'dm_fieldcfg':[
	{srcNodeId:"sel_fieldcfg",destNodeId:"dm_fieldcfg",layout:"",whereSql:"dm_fieldcfg.field_type = '0'",whereType:"",whereValue:""}
],
'event_domain_det':[
	{srcNodeId:"sys_event",destNodeId:"event_domain_det",layout:"",whereSql:"fun_id = 'sysevent' and event_index < 10000",whereType:"",whereValue:""}
],
'fun_attrdes':[
	{srcNodeId:"fun_attr",destNodeId:"fun_attrdes",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'fun_event':[
	{srcNodeId:"sys_event",destNodeId:"fun_event",layout:"",whereSql:"fun_id = 'sysevent' and event_index < 10000",whereType:"",whereValue:""}
],
'fun_tree':[
	{srcNodeId:"fun_tree",destNodeId:"fun_tree",layout:"",whereSql:"tree_id not in (select tree_id from fun_tree where fun_id = {FKEYID})",whereType:"",whereValue:""}
],
'oa_docs_obj':[
	{srcNodeId:"sys_user",destNodeId:"oa_docs_obj",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_docs_obj where obj_type = '1'  and right_type='0' and obj_id = user_id and docs_id = {FKEYID})",whereType:"",whereValue:""},
	{srcNodeId:"sys_dept",destNodeId:"oa_docs_obj",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_docs_obj where obj_type = '0' and right_type='0' and obj_id = dept_id and docs_id = {FKEYID})",whereType:"",whereValue:""}
],
'oa_docs_obj1':[
	{srcNodeId:"sys_user",destNodeId:"oa_docs_obj1",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_docs_obj where obj_type = '1'  and right_type='1' and obj_id = user_id and docs_id = {FKEYID})",whereType:"",whereValue:""},
	{srcNodeId:"sys_dept",destNodeId:"oa_docs_obj1",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_docs_obj where obj_type = '0'  and right_type='1' and obj_id = dept_id and docs_id = {FKEYID})",whereType:"",whereValue:""}
],
'oa_news_obj':[
	{srcNodeId:"sys_dept",destNodeId:"oa_news_obj",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_news_obj where obj_type = '0' and obj_id = dept_id and news_id = {FKEYID})",whereType:"",whereValue:""},
	{srcNodeId:"sys_user",destNodeId:"oa_news_obj",layout:"/public/layout/layout_tree.js",whereSql:"not exists (select * from oa_news_obj where obj_type = '1' and obj_id = user_id and news_id = {FKEYID})",whereType:"",whereValue:""}
],
'plet_fun':[
	{srcNodeId:"sel_fun",destNodeId:"plet_fun",layout:"/public/layout/layout_tree.js",whereSql:"reg_type in ('main','treemain')",whereType:"",whereValue:""}
],
'plet_portlet':[
	{srcNodeId:"sel_plettype",destNodeId:"plet_portlet",layout:"",whereSql:"not exists (select * from plet_portlet where plet_portlet.type_id = v_plet_type.type_id and plet_portlet.templet_id = {FKEYID})",whereType:"",whereValue:""}
],
'rpt_detailwf':[
	{srcNodeId:"rpt_wfnode",destNodeId:"rpt_detailwf",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'sel_funcol':[
	{srcNodeId:"sel_field",destNodeId:"sel_funcol",layout:"/jxstar/studio/pub/layout_selfield.js",whereSql:"",whereType:"",whereValue:""}
],
'store_indet':[
	{srcNodeId:"store_mat",destNodeId:"store_indet",layout:"",whereSql:"mat_id not in (select mat_id from store_indet where in_id = {FKEYID})",whereType:"",whereValue:""}
],
'sys_fun_col':[
	{srcNodeId:"sel_field",destNodeId:"sys_fun_col",layout:"/jxstar/studio/pub/layout_selfield.js",whereSql:"",whereType:"",whereValue:""}
],
'sys_post_user':[
	{srcNodeId:"sys_user",destNodeId:"sys_post_user",layout:"/public/layout/layout_tree.js",whereSql:"sys_user.is_novalid = '0' and not exists (select * from sys_post_user where sys_user.user_id = sys_post_user.user_id and post_id = {FKEYID})",whereType:"",whereValue:""}
],
'sys_qrydet':[
	{srcNodeId:"sel_fun_col",destNodeId:"sys_qrydet",layout:"",whereSql:"fun_col.col_index < 10000",whereType:"",whereValue:""}
],
'sys_role_data':[
	{srcNodeId:"sys_datatype",destNodeId:"sys_role_data",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'sys_role_field':[
	{srcNodeId:"sel_fun_col",destNodeId:"sys_role_field",layout:"",whereSql:"col_code not like '%id'",whereType:"",whereValue:""}
],
'sys_role_fun':[
	{srcNodeId:"sel_fun",destNodeId:"sys_role_fun",layout:"/public/layout/layout_tree.js",whereSql:"reg_type in ('main', 'treemain', 'selfun', 'result') and module_id not like '1010%'",whereType:"",whereValue:""}
],
'sys_role_user':[
	{srcNodeId:"sys_user",destNodeId:"sys_role_user",layout:"/public/layout/layout_tree.js",whereSql:"sys_user.is_novalid = '0'",whereType:"",whereValue:""}
],
'sys_user_data':[
	{srcNodeId:"sys_datatype",destNodeId:"sys_user_data",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'sys_user_funx':[
	{srcNodeId:"sel_fun",destNodeId:"sys_user_funx",layout:"/public/layout/layout_tree.js",whereSql:"reg_type in ('main', 'treemain', 'selfun')",whereType:"",whereValue:""}
],
'sys_user_role':[
	{srcNodeId:"sys_role",destNodeId:"sys_user_role",layout:"",whereSql:"",whereType:"",whereValue:""}
],
'sys_warnuser':[
	{srcNodeId:"sys_user",destNodeId:"sys_warnuser",layout:"/public/layout/layout_tree.js",whereSql:"sys_user.is_novalid = '0' and not exists (select * from warn_user where sys_user.user_id = warn_user.user_id and warn_id = {FKEYID})",whereType:"",whereValue:""}
],
'wf_free_user':[
	{srcNodeId:"sys_user",destNodeId:"wf_free_user",layout:"/public/layout/layout_tree.js",whereSql:"sys_user.is_novalid = '0'",whereType:"",whereValue:""}
],
'wf_node_field':[
	{srcNodeId:"sel_funcol",destNodeId:"wf_node_field",layout:"",whereSql:"not exists (select * from wf_node_field where wf_node_field.col_code = fun_col.col_code and wfnode_id = {FKEYID})",whereType:"",whereValue:""}
],
'wf_order_detcol':[
	{srcNodeId:"sel_funcol",destNodeId:"wf_order_detcol",layout:"",whereSql:"not exists (select * from wf_order_detcol where wf_order_detcol.detail_id = {FKEYID} and  fun_col.col_code = wf_order_detcol.field_name)",whereType:"",whereValue:""}
],
'wf_order_field':[
	{srcNodeId:"sel_funcol",destNodeId:"wf_order_field",layout:"",whereSql:"not exists (select * from wf_order_field where wf_order_field.order_id = {FKEYID} and  fun_col.col_code = wf_order_field.field_name)",whereType:"",whereValue:""}
],
'wf_user':[
	{srcNodeId:"sys_user",destNodeId:"wf_user",layout:"/public/layout/layout_tree.js",whereSql:"sys_user.is_novalid = '0' and not exists (select * from wf_user where sys_user.user_id = wf_user.user_id and nodeattr_id = {FKEYID})",whereType:"",whereValue:""},
	{srcNodeId:"sys_post",destNodeId:"wf_user",layout:"",whereSql:"sys_post.auditing = '0' and not exists (select * from wf_user where sys_post.post_id = wf_user.user_id and nodeattr_id = {FKEYID})",whereType:"",whereValue:""}
]
};