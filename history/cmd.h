#pragma once

#include "constants.h"
#include "input.h"

typedef struct cmd_s {
  char *argv[MAXARGS];
  int   argc;
} cmd_t;

typedef int (*builtin_t)(cmd_t *cmd);

void  init_cmd(cmd_t *cmd);
void  free_cmd(cmd_t *cmd);
int   parse_cmd(cmd_t *cmd, char *str);
int   process_cmd(char *cmdstr, int n_paths, char **paths);
char *cmd_as_str(char *dest, cmd_t *cmd, int n);

int register_builtin(char *name, builtin_t builtin);
int is_builtin(cmd_t *cmd);
int is_binary(cmd_t *cmd, char **paths, int n_paths);

int execute_binary(cmd_t *cmd);
int execute_builtin(cmd_t *cmd);

int  cmd_prompt_len(input_t *in);

void clear_cmd_prompt(input_t *in);
void display_cmd_prompt(input_t *in, int mode_changed, int refresh);

