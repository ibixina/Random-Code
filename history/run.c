#include <stdlib.h>

#include "shell.h"
#include "history.h"

int main(int argc, char **argv) {
  int ret = 0;

  /* initializes a history instance */
  history_t hist = {0, NULL, NULL};

  /* starts the shell loop */
  ret = run(&hist);

  return ret;
}
