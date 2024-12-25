#include <dirent.h>
#include <grp.h>
#include <pwd.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  int checkL, checkA = 0;
  struct stat sb;
  char perm[11];
  char *user, *group;
  int fsize;

  struct passwd *pwd;
  struct group *gwd;

  for (int i = 1; i < argc; i++) {
    if (strcmp(argv[i], "-l") == 0) {
      checkL = 1;
    } else if (strcmp(argv[i], "-a") == 0) {
      checkA = 1;
    } else {
      printf("ls: invalid option %s\n", argv[i]);
      return 2;
    }
  }

  DIR *dirp = opendir(".");
  struct dirent *values;
  char *name;
  while ((values = readdir(dirp)) != NULL) {
    name = values->d_name;

    if (name[0] == '.' && checkA == 0) {
      continue;
    }
    if (checkL != 0) {

      stat(name, &sb);

      pwd = getpwuid(sb.st_uid);
      user = pwd->pw_name;
      gwd = getgrgid(sb.st_gid);
      group = gwd->gr_name;
      fsize = (int)sb.st_size;
      perm[0] = (S_ISDIR(sb.st_mode)) ? 'd' : '-';
      perm[1] = (sb.st_mode & S_IRUSR) ? 'r' : '-';
      perm[2] = (sb.st_mode & S_IWUSR) ? 'w' : '-';
      perm[3] = (sb.st_mode & S_IXUSR) ? 'x' : '-';
      perm[4] = (sb.st_mode & S_IRGRP) ? 'r' : '-';
      perm[5] = (sb.st_mode & S_IWGRP) ? 'w' : '-';
      perm[6] = (sb.st_mode & S_IXGRP) ? 'x' : '-';
      perm[7] = (sb.st_mode & S_IROTH) ? 'r' : '-';
      perm[8] = (sb.st_mode & S_IWOTH) ? 'w' : '-';
      perm[9] = (sb.st_mode & S_IXOTH) ? 'x' : '-';
      perm[10] = '\0';

      printf("%s %10s %10s % 6d %s\n", perm, user, group, fsize, name);
    } else {

      printf("%s\n", name);
    }
  }

  closedir(dirp);
  return 0;
}
