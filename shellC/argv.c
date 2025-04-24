#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

int main(void) {
  char *path = getenv("PATH");
  char *paths[100];
  int loc = 0;

  char *temp = strtok(path, " : ");
  while (temp != NULL) {
    paths[loc] = temp;
    loc++;
    temp = strtok(NULL, " : ");
  }

  int max_length = 20;
  char cmd[max_length];
  for (;;) {
    memset(cmd, '0', max_length);
    printf("$");
    if (fgets(cmd, max_length, stdin) == NULL) {
      perror("Error");
      return 1;
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
    } else if (strcmp(cmd, "cd") == 0) {
      if (chdir(getenv("HOME")) != 0) {
        perror("Error");
      }
    } else if (strncmp(cmd, "cd ", 3) == 0) {
      char *newLoc = &cmd[3];
      if (strlen(newLoc) == 0) {
        newLoc = getenv("HOME");
      }
      if (chdir(newLoc) != 0) {
        perror("Error");
      }
    } else {
      // 4th part
      char *argList[20];

      char *arg = strtok(cmd, "   ");
      int argLoc = 0;
      while (arg != NULL) {
        argList[argLoc] = arg;
        arg = strtok(NULL, "   ");
        argLoc++;
      }

      if (access(argList[0], F_OK) != 0) {

        char tempstr[100];
        int found_ex = 0;
        for (int i = 0; i < loc; i++) {
          strcpy(tempstr, paths[i]);
          strcat(tempstr, "/");
          strcat(tempstr, argList[0]);

          if (access(tempstr, F_OK) == 0) {
            found_ex = 1;

            argList[0] = tempstr;
            break;
          }
        }
        if (found_ex == 0) {
          printf("unable to locate executable '%s'\n", cmd);
        }
      }

      int nloc = 0;

      while (nloc < argLoc) {
        printf("%s\n", argList[nloc]);
        nloc++;
      }
    }
  }
  return 0;
}
