#include <errno.h>
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
      if (access(cmd, F_OK) != 0) {

        char tempstr[100];
        int found_ex = 0;
        for (int i = 0; i < loc; i++) {
          strcpy(tempstr, paths[i]);
          strcat(tempstr, "/");
          strcat(tempstr, cmd);
          if (access(tempstr, F_OK) == 0) {
            found_ex = 1;

            struct stat sb;
            stat(tempstr, &sb);

            printf("located '%s' at '%s' which is %d bytes\n", cmd, tempstr,
                   (int)sb.st_size);
            break;
          }
        }
        if (found_ex == 0) {
          printf("unable to locate executable '%s'\n", cmd);
        }
      }
    }
  }
  return 0;
}
