/*
 * Cube.js
 *
 * Cube.js Swagger Schema
 *
 * The version of the OpenAPI document: 1.0.0
 *
 * Generated by: https://openapi-generator.tech
 */

#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct V1CubeMetaFolder {
    #[serde(rename = "name")]
    pub name: String,
    #[serde(rename = "members")]
    pub members: Vec<String>,
}

impl V1CubeMetaFolder {
    pub fn new(name: String, members: Vec<String>) -> V1CubeMetaFolder {
        V1CubeMetaFolder { name, members }
    }
}
