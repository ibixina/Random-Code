#include "node.h"
#include "util.h"
#include <stdio.h>
#include <stdlib.h>

int insert_before(node_t *loc, node_t *n) {
  /* TODO: REPLACE THIS WITH YOUR IMPLEMENTATION */
  if (n == NULL || loc == NULL) {
    return RET_FAILURE;
  }
  node_t *prev = loc->prev;
  if (prev != NULL) {
    prev->next = n;

  } else {
    n->prev = NULL;
  }
  n->next = loc;
  n->prev = loc->prev;
  loc->prev = n;
  return RET_SUCCESS;
}

int insert_after(node_t *loc, node_t *n) {
  /* TODO: REPLACE THIS WITH YOUR IMPLEMENTATION */
  if (n == NULL || loc == NULL) {
    return RET_FAILURE;
  }
  node_t *next = loc->next;
  if (next != NULL) {
    next->prev = n;
    n->next = next;
  }

  n->prev = loc;
  loc->next = n;

  return RET_SUCCESS;
}

int remove_node(node_t *n) {
  /* TODO: REPLACE THIS WITH YOUR IMPLEMENTATION */
  if (n == NULL) {
    return RET_FAILURE;
  }
  node_t *next = n->next;
  node_t *prev = n->prev;

  if (next == NULL) {
    prev->next = NULL;
  } else if (prev == NULL) {
    next->prev = NULL;
  } else {
    prev->next = next;
    next->prev = prev;
  }

  return RET_SUCCESS;
}

int apply(node_t *n, iter_dir_t dir, node_func f) {
  /* TODO: REPLACE THIS WITH YOUR IMPLEMENTATION */
  if (n == NULL || f == NULL) {
    return RET_FAILURE;
  }
  while (n != NULL) {
    f(n);
    if (dir == FORWARD) {
      n = n->next;
    } else {
      n = n->prev;
    }
  }
  return RET_SUCCESS;
}
