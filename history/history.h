#pragma once

#include "node.h"
#include "cmd.h"

/* used to track a location in the command history */
typedef node_t *hist_ctx_t;

typedef struct {
  int size;
  hist_ctx_t last;  /* most recent */
  hist_ctx_t first; /* oldest */
} history_t;

void set_history(history_t *hist);
history_t *get_history();

/*
 * Function:  update_history 
 * -------------------------
 *
 * adds a new element to the command history for hist_str. new memory will be allocated
 * (on the heap) for this new element, and it will be added to the end of the history
 * list.
 *
 *  hist_str: a complete commandline string including arguments (e.g., "ls -l")
 *
 *  returns: a new hist_ctx_t containing hist_str. 
 *           the new element will become the last element of the history.
 *           if history empty before call, it will also be the first history element. 
 */
hist_ctx_t update_history(char *hist_str);

/*
 * Function:  clear_history 
 * ------------------------
 *
 * removes all elements for history, freeing memory that was previously allocated.
 *
 *  returns: none
 */
void clear_history(void);

/*
 * Function:  prev_history 
 * -------------------------
 *
 * returns the element immediately before ctx in history.
 *
 *  ctx: the history context from which the previous element will be retrieved
 *
 *  returns: the history element immediately before ctx (if one exists) else NULL. 
 *           NULL is returned when ctx is NULL.
 */
hist_ctx_t prev_hist(hist_ctx_t ctx);

/*
 * Function:  next_history 
 * -----------------------
 *
 * returns the element immediately after ctx in history.
 *
 *  ctx: the history context from which the next element will be retrieved
 *
 *  returns: the history element immediately after ctx (if one exists) else NULL. 
 *           NULL is returned when ctx is NULL.
 */
hist_ctx_t next_hist(hist_ctx_t ctx);

/*
 * Function:  find_match 
 * ---------------------
 *
 * returns the first partial match to search_term based on a backward search 
 *   through the command history. For example, a search_term of "ls" would
 *   match history elements containing "ls", "ls -l", or "also" as command
 *   strings.
 *
 *  search_term: the search string that must be a substring of matched elements
 *  ctx: the history element from which the search will begin
 *
 *  returns: the first hist_ctx_t matching search_term or NULL if one cannot be found. 
 *           NULL is returned when ctx is NULL.
 */
hist_ctx_t find_match(char *search_term, hist_ctx_t ctx); 

/*
 * Function:  find_first_match 
 * ---------------------------
 *
 * returns the first partial match to search_term based on a backward search 
 *   through the command history starting with the last element in the history. 
 *   For example, a search_term of "ls" would match history elements containing 
 *   "ls", "ls -l", or "also" as command strings.
 *
 *  search_term: the search string that must be a substring of matched elements
 *
 *  returns: the first hist_ctx_t matching search_term or NULL if one cannot be found. 
 *           NULL is returned when ctx is NULL.
 */
hist_ctx_t find_first_match(char *search_term); 

/*
 * Function:  show_history 
 * -----------------------
 *
 * displays a list of history elements (shown one per line, oldest to newest).
 * if 0 < n < history.size, then only the most recent n history elements will
 * be displayed.
 *
 *  n: the number of history elements to display.
 *
 *  returns: RET_FAILURE if n <= 0; RET_SUCCESS and displays elements to stdout 
 *   otherwise.
 */
int show_history(int n);

/* implements the history built-in */
int history_builtin(cmd_t *cmd);

/* provides a history string appropriate for display from the history built-in */
int hist_str(char *buff, hist_ctx_t ctx, int n);
