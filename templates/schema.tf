resource "snowflake_schema" "schema" {
  name                = "TEST_SCHEMA" # required
  database            = "SNOWFLAKE_LEARNING_DB" # required
  # with_managed_access = true # optional
  # is_transient        = true # optional
  # comment             = "my schema" # optional

  # data_retention_time_in_days                   = 1 # optional
  # max_data_extension_time_in_days               = 20 # optional
  # external_volume                               = "<external_volume_name>" # optional
  # catalog                                       = "<catalog_name>" # optional
  # replace_invalid_characters                    = false # optional
  # default_ddl_collation                         = "en_US" # optional
  # storage_serialization_policy                  = "COMPATIBLE" # optional
  # log_level                                     = "INFO" # optional
  # trace_level                                   = "ALWAYS" # optional
  # suspend_task_after_num_failures               = 10 # optional
  # task_auto_retry_attempts                      = 10 # optional
  # user_task_managed_initial_warehouse_size      = "LARGE" # optional
  # user_task_timeout_ms                          = 3600000 # optional
  # user_task_minimum_trigger_interval_in_seconds = 120 # optional
  # quoted_identifiers_ignore_case                = false # optional
  # enable_console_output                         = false # optional
  # pipe_execution_paused                         = false # optional

}