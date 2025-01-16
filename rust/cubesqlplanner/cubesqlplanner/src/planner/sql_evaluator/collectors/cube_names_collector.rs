use crate::planner::sql_evaluator::{MemberSymbol, TraversalVisitor};
use cubenativeutils::CubeError;
use std::collections::HashSet;
use std::rc::Rc;

pub struct CubeNamesCollector {
    names: HashSet<String>,
}

impl CubeNamesCollector {
    pub fn new() -> Self {
        Self {
            names: HashSet::new(),
        }
    }

    pub fn extract_result(self) -> Vec<String> {
        self.names.into_iter().collect()
    }
}

impl TraversalVisitor for CubeNamesCollector {
    type State = ();
    fn on_node_traverse(
        &mut self,
        node: &Rc<MemberSymbol>,
        _: &Self::State,
    ) -> Result<Option<Self::State>, CubeError> {
        match node.as_ref() {
            MemberSymbol::Dimension(e) => {
                if e.owned_by_cube() {
                    self.names.insert(e.cube_name().clone());
                }
                if e.is_sub_query() {
                    return Ok(None);
                }
                for name in e.get_dependent_cubes().into_iter() {
                    self.names.insert(name);
                }
            }
            MemberSymbol::TimeDimension(e) => self.apply(e.base_symbol(), &())?,
            MemberSymbol::Measure(e) => {
                if e.owned_by_cube() {
                    self.names.insert(e.cube_name().clone());
                }
                for name in e.get_dependent_cubes().into_iter() {
                    self.names.insert(name);
                }
            }
            MemberSymbol::CubeName(e) => {
                self.names.insert(e.cube_name().clone());
            }
            MemberSymbol::CubeTable(e) => {
                self.names.insert(e.cube_name().clone());
            }
            MemberSymbol::SqlCall(s) => {
                for name in s.get_dependent_cubes().into_iter() {
                    self.names.insert(name);
                }
            }
        };
        Ok(Some(()))
    }
}

pub fn collect_cube_names(node: &Rc<MemberSymbol>) -> Result<Vec<String>, CubeError> {
    let mut visitor = CubeNamesCollector::new();
    visitor.apply(node, &())?;
    Ok(visitor.extract_result())
}
