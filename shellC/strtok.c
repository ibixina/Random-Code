#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
  char *path = getenv("PATH");
  char *paths[100];
  int loc = 0;

  printf("%s\n", path);

  char *temp = strtok(path, " : ");
  while (temp != NULL) {
    paths[loc] = temp;
    loc++;
    temp = strtok(NULL, " : ");
  }

  for (int i = 0; i < loc; i++) {
    printf("%s\n", paths[i]);
  }

  return 0;
}
