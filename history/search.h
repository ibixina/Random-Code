#pragma once

#include "input.h"
#include "cmd.h"

void display_search_prompt(input_t *in, char *hist_str, int mode_changed, int refresh, int ret_code);
int search_prompt_len(input_t *in, char *match_str, int ret_code);
