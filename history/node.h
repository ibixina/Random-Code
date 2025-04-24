#pragma once

/* an element of a doubly linked list */
typedef struct node_s {
  int id;
  char *str;
  struct node_s *next;
  struct node_s *prev;
} node_t;

typedef enum { FORWARD, BACKWARD } iter_dir_t;
typedef void (*node_func)(node_t *n);

/*
 * Function:  insert_before
 * ------------------------
 *
 * adds n to linked list immediately before loc.
 *
 *  loc: the node that will be immediately after n in the linked list
 *  n:   the node that will be added to the linked list before loc
 *
 *  returns: RET_FAILURE if loc or n is NULL; RET_SUCCESS and updates linked
 *            list to include n before loc.
 */
int insert_before(node_t *loc, node_t *n);

/*
 * Function:  insert_after
 * -----------------------
 *
 * adds n to linked list immediately after loc.
 *
 *  loc: the node that will be immediately before n in the linked list
 *  n: the node that will be added to the linked list after loc
 *
 *  returns: RET_FAILURE if loc or n is NULL; RET_SUCCESS and updates linked
 *            list to include n after loc.
 */
int insert_after(node_t *loc, node_t *n);

/*
 * Function:  remove_node
 * ----------------------
 *
 * removes n from the linked list.
 *
 *  n: the node to remove.
 *
 *  returns: RET_FAILURE if n is NULL; RET_SUCCESS and n removed from the linked
 *            list otherwise.
 */
int remove_node(node_t *n);

/*
 * Function:  apply
 * ----------------
 *
 * applys a function f to each node in a linked list, starting from n
 *  and iterating over remaining nodes in the direction specified by dir.
 *
 *  n:   the first node on which the function f will be applied.
 *  dir: the direction of iteration.
 *  f:   a function that will be invoked on each node.
 *
 *  returns: RET_FAILURE if n or f is NULL; RET_SUCCESS and applied f
 *            to each traversed node (starting from n) otherwise.
 */
int apply(node_t *n, iter_dir_t dir, node_func f);
