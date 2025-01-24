use crate::{
    compile::rewrite::{
        cube_scan_wrapper, projection,
        rewriter::{CubeEGraph, CubeRewrite},
        rules::wrapper::WrapperRules,
        subquery, transforming_rewrite, wrapped_select, wrapped_select_aggr_expr_empty_tail,
        wrapped_select_filter_expr_empty_tail, wrapped_select_group_expr_empty_tail,
        wrapped_select_having_expr_empty_tail, wrapped_select_joins_empty_tail,
        wrapped_select_order_expr_empty_tail, wrapped_select_subqueries_empty_tail,
        wrapped_select_window_expr_empty_tail, wrapper_pullup_replacer, wrapper_pushdown_replacer,
        wrapper_replacer_context, ListType, LogicalPlanLanguage, ProjectionAlias,
        WrappedSelectAlias, WrappedSelectPushToCube, WrappedSelectUngroupedScan,
        WrapperReplacerContextPushToCube,
    },
    var, var_iter,
};
use egg::{Subst, Var};

impl WrapperRules {
    pub fn projection_rules(&self, rules: &mut Vec<CubeRewrite>) {
        rules.extend(vec![transforming_rewrite(
            "wrapper-push-down-projection-to-cube-scan",
            projection(
                "?expr",
                cube_scan_wrapper(
                    wrapper_pullup_replacer(
                        "?cube_scan_input",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "?in_projection",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    "CubeScanWrapperFinalized:false",
                ),
                "?projection_alias",
                "ProjectionSplit:false",
            ),
            cube_scan_wrapper(
                wrapped_select(
                    "WrappedSelectSelectType:Projection",
                    wrapper_pushdown_replacer(
                        "?expr",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_subqueries_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_group_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_aggr_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_window_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        "?cube_scan_input",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_joins_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_filter_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapped_select_having_expr_empty_tail(),
                    "WrappedSelectLimit:None",
                    "WrappedSelectOffset:None",
                    wrapper_pullup_replacer(
                        wrapped_select_order_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    "?select_alias",
                    "WrappedSelectDistinct:false",
                    "?select_push_to_cube",
                    "?select_ungrouped_scan",
                ),
                "CubeScanWrapperFinalized:false",
            ),
            self.transform_projection(
                "?expr",
                "?projection_alias",
                "?push_to_cube",
                "?select_alias",
                "?select_push_to_cube",
                "?select_ungrouped_scan",
            ),
        )]);

        if self.config_obj.push_down_pull_up_split() {
            Self::flat_list_pushdown_pullup_rules(
                rules,
                "wrapper-projection-expr",
                ListType::ProjectionExpr,
                ListType::WrappedSelectProjectionExpr,
            );
        } else {
            Self::list_pushdown_pullup_rules(
                rules,
                "wrapper-projection-expr",
                "ProjectionExpr",
                "WrappedSelectProjectionExpr",
            );
        }
    }

    pub fn projection_rules_subquery(&self, rules: &mut Vec<CubeRewrite>) {
        rules.extend(vec![transforming_rewrite(
            "wrapper-push-down-projection-and-subquery-to-cube-scan",
            projection(
                "?expr",
                subquery(
                    cube_scan_wrapper(
                        wrapper_pullup_replacer(
                            "?cube_scan_input",
                            wrapper_replacer_context(
                                "?alias_to_cube",
                                "?push_to_cube",
                                "?in_projection",
                                "?cube_members",
                                "?grouped_subqueries",
                            ),
                        ),
                        "CubeScanWrapperFinalized:false",
                    ),
                    "?subqueries",
                    "?types",
                ),
                "?projection_alias",
                "ProjectionSplit:false",
            ),
            cube_scan_wrapper(
                wrapped_select(
                    "WrappedSelectSelectType:Projection",
                    wrapper_pushdown_replacer(
                        "?expr",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pushdown_replacer(
                        "?subqueries",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_group_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_aggr_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_window_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        "?cube_scan_input",
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_joins_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapper_pullup_replacer(
                        wrapped_select_filter_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    wrapped_select_having_expr_empty_tail(),
                    "WrappedSelectLimit:None",
                    "WrappedSelectOffset:None",
                    wrapper_pullup_replacer(
                        wrapped_select_order_expr_empty_tail(),
                        wrapper_replacer_context(
                            "?alias_to_cube",
                            "?push_to_cube",
                            "WrapperReplacerContextInProjection:true",
                            "?cube_members",
                            "?grouped_subqueries",
                        ),
                    ),
                    "?select_alias",
                    "WrappedSelectDistinct:false",
                    "?select_push_to_cube",
                    "?select_ungrouped_scan",
                ),
                "CubeScanWrapperFinalized:false",
            ),
            self.transform_projection_subquery(
                "?alias_to_cube",
                "?expr",
                "?projection_alias",
                "?push_to_cube",
                "?select_alias",
                "?select_push_to_cube",
                "?select_ungrouped_scan",
            ),
        )]);
    }
    fn transform_projection(
        &self,
        expr_var: &'static str,
        projection_alias_var: &'static str,
        push_to_cube_var: &'static str,
        select_alias_var: &'static str,
        select_push_to_cube_var: &'static str,
        select_ungrouped_scan_var: &'static str,
    ) -> impl Fn(&mut CubeEGraph, &mut Subst) -> bool {
        let expr_var = var!(expr_var);
        let projection_alias_var = var!(projection_alias_var);
        let push_to_cube_var = var!(push_to_cube_var);
        let select_alias_var = var!(select_alias_var);
        let select_push_to_cube_var = var!(select_push_to_cube_var);
        let select_ungrouped_scan_var = var!(select_ungrouped_scan_var);
        move |egraph, subst| {
            Self::transform_projection_impl(
                egraph,
                subst,
                expr_var,
                projection_alias_var,
                push_to_cube_var,
                select_alias_var,
                select_push_to_cube_var,
                select_ungrouped_scan_var,
            )
        }
    }

    fn transform_projection_subquery(
        &self,
        alias_to_cube_var: &'static str,
        expr_var: &'static str,
        projection_alias_var: &'static str,
        push_to_cube_var: &'static str,
        select_alias_var: &'static str,
        select_push_to_cube_var: &'static str,
        select_ungrouped_scan_var: &'static str,
    ) -> impl Fn(&mut CubeEGraph, &mut Subst) -> bool {
        let alias_to_cube_var = var!(alias_to_cube_var);
        let expr_var = var!(expr_var);
        let projection_alias_var = var!(projection_alias_var);
        let push_to_cube_var = var!(push_to_cube_var);
        let select_alias_var = var!(select_alias_var);
        let select_push_to_cube_var = var!(select_push_to_cube_var);
        let select_ungrouped_scan_var = var!(select_ungrouped_scan_var);
        let meta = self.meta_context.clone();
        move |egraph, subst| {
            if Self::transform_check_subquery_allowed(
                egraph,
                subst,
                meta.clone(),
                alias_to_cube_var,
            ) {
                Self::transform_projection_impl(
                    egraph,
                    subst,
                    expr_var,
                    projection_alias_var,
                    push_to_cube_var,
                    select_alias_var,
                    select_push_to_cube_var,
                    select_ungrouped_scan_var,
                )
            } else {
                false
            }
        }
    }

    fn transform_projection_impl(
        egraph: &mut CubeEGraph,
        subst: &mut Subst,
        expr_var: Var,
        projection_alias_var: Var,
        push_to_cube_var: Var,
        select_alias_var: Var,
        select_push_to_cube_var: Var,
        select_ungrouped_scan_var: Var,
    ) -> bool {
        if let Some(_) = &egraph[subst[expr_var]].data.referenced_expr {
            for projection_alias in
                var_iter!(egraph[subst[projection_alias_var]], ProjectionAlias).cloned()
            {
                for push_to_cube in var_iter!(
                    egraph[subst[push_to_cube_var]],
                    WrapperReplacerContextPushToCube
                )
                .cloned()
                {
                    subst.insert(
                        select_push_to_cube_var,
                        egraph.add(LogicalPlanLanguage::WrappedSelectPushToCube(
                            WrappedSelectPushToCube(push_to_cube),
                        )),
                    );
                    subst.insert(
                        select_ungrouped_scan_var,
                        egraph.add(LogicalPlanLanguage::WrappedSelectUngroupedScan(
                            WrappedSelectUngroupedScan(push_to_cube),
                        )),
                    );
                    subst.insert(
                        select_alias_var,
                        egraph.add(LogicalPlanLanguage::WrappedSelectAlias(WrappedSelectAlias(
                            projection_alias,
                        ))),
                    );
                    return true;
                }
            }
        }

        false
    }
}
