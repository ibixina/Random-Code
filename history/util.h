#pragma once

#include "cmd.h"

void parse_path(char **paths, int *count);
int  search_paths(cmd_t *cmd, char **paths, int n_paths);

void not_implemented(char *func);
