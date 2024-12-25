#include "history.h"
#include "constants.h"
#include "util.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

history_t *g_history = NULL;

/*********************************
 * function prototypes (private) *
 ********************************/
void show_hist_str(hist_ctx_t ctx);

/************************
 * function definitions *
 ***********************/
hist_ctx_t update_history(char *hist_str) {
  hist_ctx_t newNode = malloc(sizeof(node_t));
  if (newNode == NULL) {
    perror("Error: ");
  } else {
    newNode->id = g_history->size;
    newNode->str = malloc(200);
    strcpy(newNode->str, hist_str);
    newNode->next = NULL;
    newNode->prev = g_history->last;

    if (insert_after(g_history->last, newNode) == RET_FAILURE &&
        g_history->first == NULL) {
      g_history->first = newNode;
    }
    g_history->last = newNode;

    g_history->size++;
  }

  return newNode;
}

void clear_history(void) {
  hist_ctx_t node = g_history->first;

  hist_ctx_t temp = NULL;
  while (node != NULL) {
    temp = node;
    node = node->next;
    free(temp);
  }

  // free(node);

  g_history->first = NULL;
  g_history->last = NULL;
  g_history->size = 0;
}

hist_ctx_t prev_hist(hist_ctx_t ctx) {
  if (ctx == NULL) {
    return NULL;
  }
  return ctx->prev;
}

hist_ctx_t next_hist(hist_ctx_t ctx) {
  if (ctx == NULL) {
    return NULL;
  }
  return ctx->next;
}

hist_ctx_t find_match(char *search_term, hist_ctx_t ctx) {

  while (ctx != NULL) {
    if (strstr(ctx->str, search_term) != NULL) {
      return ctx;
    }
    ctx = prev_hist(ctx);
  }
  return NULL;
}

hist_ctx_t find_first_match(char *search_term) {
  hist_ctx_t last = g_history->last;
  return find_match(search_term, last);
}

int show_history(int n) {
  if (n <= 0) {
    return RET_FAILURE;
  }

  hist_ctx_t curr = g_history->first;
  if (n >= g_history->size) {
    return apply(curr, FORWARD, show_hist_str);
  }

  while (n > 0 && curr != NULL) {
    show_hist_str(curr);
    curr = curr->next;
    n--;
  }
  return RET_SUCCESS;
}

/****************************
 * provided implementations *
 ***************************/
void set_history(history_t *hist) { g_history = hist; }

history_t *get_history(void) { return g_history; }

/* formats a string in the format used for the history builtin */
int hist_str(char *buff, hist_ctx_t ctx, int n) {
  if (ctx) {
    snprintf(buff, n, " %d\t%s", ctx->id, ctx->str);
    return RET_SUCCESS;
  }
  return RET_FAILURE;
}

void show_hist_str(hist_ctx_t ctx) {
  char buff[MAXHISTSTR];

  if (ctx) {
    if (hist_str(buff, ctx, MAXHISTSTR)) {
      fprintf(stderr, "hist_str: buffer (size: %d) too small!\n", MAXHISTSTR);
    } else {
      printf("%s\n", buff);
    }
  }
}

int history_builtin(cmd_t *cmd) {
  long n = 0;

  /* case 1 (no args): history with no arguments display entire history.
   *
   *   $ history
   *
   *    0  ls -l
   *    1  pwd
   *    2  ps
   *    3  cd
   *    4  history
   */
  if (cmd->argc == 1) {
    show_history(g_history->size);
  }

  else if (cmd->argc == 2) {

    /* case 2 (history -c): clears history */
    if (strcmp("-c", cmd->argv[1]) == 0) {
      clear_history();
    }

    /* case 3 (history [N]): history with a single numeric argument prints
     * last N commands.
     *
     *   $ history 2
     *    0  history 2
     *    1  ls -l
     *    2  pwd
     */
    else {
      n = strtol(cmd->argv[1], NULL, 10);

      /* bad input */
      if (n <= 0) {
        fprintf(stderr, "history: numeric argument required\n");
        return RET_FAILURE;
      }
      show_history(n);
    }
  }

  /* unsupported option */
  else {
    fprintf(stderr, "history: unsupported arguments\n");
    return RET_FAILURE;
  }

  return RET_SUCCESS;
}
