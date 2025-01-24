use super::context::ContextHolder;
use super::object::base_types::*;
use super::object::neon_array::NeonArray;
use super::object::neon_function::NeonFunction;
use super::object::neon_struct::NeonStruct;
use super::object::NeonObject;
use crate::wrappers::inner_types::InnerTypes;
use neon::prelude::*;
use std::marker::PhantomData;

pub struct NeonInnerTypes<C: Context<'static>> {
    marker: PhantomData<ContextHolder<C>>,
}

impl<C: Context<'static>> Clone for NeonInnerTypes<C> {
    fn clone(&self) -> Self {
        Self {
            marker: Default::default(),
        }
    }
}

impl<C: Context<'static> + 'static> InnerTypes for NeonInnerTypes<C> {
    type Object = NeonObject<C>;
    type Context = ContextHolder<C>;
    type Array = NeonArray<C>;
    type Struct = NeonStruct<C>;
    type String = NeonString<C>;
    type Boolean = NeonBoolean<C>;
    type Function = NeonFunction<C>;
    type Number = NeonNumber<C>;
}
