#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(void) {
  char *path = getenv("PATH");
  if (path == NULL) {
    perror("Error");
    return 1;
  }
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
  int max_length = 20;
  char cmd[max_length];
  for (;;) {
    printf("$");
    if (fgets(cmd, 20, stdin) == NULL) {
      return 0;
    }

    for (int i = 0; i < max_length; i++) {
      if (cmd[i] == '\n') {
        cmd[i] = '\0';
        break;
      }
    }
    if (strcmp(cmd, "exit") == 0) {
      return 0;
    }

    if (strcmp(cmd, "pwd") == 0) {
      char pwd[100];
      getcwd(pwd, 100);
      printf("%s\n", pwd);
    } else if (strncmp(cmd, "cd ", 3) == 0) {
      char *newLoc = &cmd[3];
      if (strlen(newLoc) == 0) {
        newLoc = getenv("HOME");
      }
      if (chdir(newLoc) != 0) {
        perror("Error");
      }
    } else if (strcmp(cmd, "cd") == 0) {
      if (chdir(getenv("HOME")) != 0) {
        perror("Error");
      }
    }
  }
  return 0;
}
