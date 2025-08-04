# basic resource
resource "snowflake_streamlit" "streamlit" {
  database  = var.database
  schema    = var.schema
  name      = var.name
  stage     = var.stage
  main_file = var.main_file
}

# # resource with all fields set
# resource "snowflake_streamlit" "streamlit" {
#   database                     = "database"
#   schema                       = "schema"
#   name                         = "streamlit"
#   stage                        = snowflake_stage.example.fully_qualified_name
#   directory_location           = "src"
#   main_file                    = "streamlit_main.py"
#   query_warehouse              = snowflake_warehouse.example.fully_qualified_name
#   external_access_integrations = ["integration_id"]
#   title                        = "title"
#   comment                      = "comment"
# }