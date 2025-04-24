#include <arpa/inet.h>
#include <fcntl.h>
#include <netdb.h>
#include <netinet/in.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/errno.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <time.h>
#include <unistd.h>

#include "chat.h"
#define MAXDATASIZE 100
#define BACKLOG 10

global_t g;

/**
 * client_setup - establish TCP connection to chat server
 *
 * @returns socket file descriptor
 */
int client_setup(void) {
  int sockfd = -1;

  // get IP address for host string
  // create a socket
  // connect to server
  int numbytes;
  char buf[MAXDATASIZE];
  struct addrinfo hints, *servinfo, *p;
  int rv;
  char s[INET6_ADDRSTRLEN];

  memset(&hints, 0, sizeof hints);
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;

  if ((rv = getaddrinfo(g.hoststr, g.portstr, &hints, &servinfo)) != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
    return 1;
  }

  for (p = servinfo; p != NULL; p = p->ai_next) {
    if ((sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
      perror("client: socket");
      continue;
    }

    if (connect(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
      close(sockfd);
      perror("client: connect");
      continue;
    }
    printf("connected to server... \n");
    break;
  }

  // leave these here
  nonblock(STDIN_FILENO);
  nonblock(sockfd);

  return sockfd;
}

/**
 * client_chat - reads messages from stdin/socket and writes to socket/stdout
 *
 * @param sockfd - socket file descriptor
 */
void client_chat(int sockfd) {
  int eof = 0;
  char buf[BUFSIZE];

  while (!eof) {
    int n;

    // implement me
    n = read(sockfd, buf, BUFSIZE);
    if (n == -1) {
      if (errno != EAGAIN) {
        perror("client_chat");
      }
    } else if (n == 0) {
      close(sockfd);
      return;
    } else {
      if (write(STDOUT_FILENO, buf, n) == -1) {
        perror("client_chat_write");
      }
    }

    n = read(STDOUT_FILENO, buf, BUFSIZE);
    if (n == -1) {
      if (errno != EAGAIN) {
        perror("client_chat");
      }
    } else if (n == 0) {
      close(sockfd);
      return;
    } else {
      if (write(sockfd, buf, n) == -1) {
        perror("client_chat");
      }
    }

    // avoid true busy waiting
    pwait();
  }
}

/**
 * server_setup - setup TCP chat listener
 *
 * @returns socket file descriptor
 */
int server_setup(void) {
  struct addrinfo hints, *servinfo;
  int sockfd = -1;
  int val;

  // implement me
  int newfd;
  struct addrinfo *p;
  struct sockaddr_storage their_addr;
  socklen_t sin_size;
  int yes = 1;
  char s[INET6_ADDRSTRLEN];
  int rv;

  memset(&hints, 0, sizeof hints);
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_flags = AI_PASSIVE;

  if ((rv = getaddrinfo(NULL, g.portstr, &hints, &servinfo)) != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
    return 1;
  }

  for (p = servinfo; p != NULL; p = p->ai_next) {
    if ((sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
      perror("server: socket");
      continue;
    }

    if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int)) == -1) {
      perror("setsockopt");
      exit(1);
    }

    if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
      close(sockfd);
      perror("server: bind");
      continue;
    }

    break;
  }

  freeaddrinfo(servinfo);

  if (p == NULL) {
    fprintf(stderr, "server: failed to bind\n");
    exit(1);
  }

  if (listen(sockfd, BACKLOG) == -1) {
    perror("listen");
    exit(1);
  }
  printf("server: waiting for connections...\n");

  // permit rapid re-use of server port
  val = 1;
  setsockopt(sockfd, SOL_SOCKET, SO_REUSEPORT, &val, sizeof(val));

  nonblock(sockfd);

  return sockfd;
}

/*
 * relay - read messages from clients in shared memory, then send to all other
 * clients/monitor
 *
 * @param sockfd - the main listen socket to accept() new connections on
 */
void relay(int sockfd) {
  int eof = 0, i;
  char *fullmsg = "All chat connections are currently in use.\n";

  // initialize all connections

  // implement me
  for (i = 0; i < MAXCLIENTS; i++) {
    g.conn[i].status = Unconnected;
    g.conn[i].id = i;
    pthread_mutex_init(&g.conn[i].mutex, NULL);
  }
  g.conn[0].status = Delivered; // set the monitor's status

  conn_t *monitor = &g.conn[0];
  while (!eof) {

    // implement me
    if (monitor->status == EndOfFile) {
      break;
    }
    struct sockaddr_storage their_addr;
    socklen_t sin_size = sizeof their_addr;
    int accept_result =
        accept(sockfd, (struct sockaddr *)&their_addr, &sin_size);
    if (accept_result != -1) { // accept sock fd
      int foundConnection = 0;
      int checkIndex = 1;
      while (foundConnection == 0 && checkIndex < MAXCLIENTS) {
        if (g.conn[checkIndex].status == Unconnected) {
          foundConnection = 1;

          g.conn[checkIndex].status = Delivered;
          g.conn[checkIndex].sockfd = accept_result;
          pthread_create(&g.conn[checkIndex].tid, NULL, server_chat,
                         &g.conn[checkIndex]);
        }
        checkIndex++;
      }
      if (foundConnection == 0) {
        // send server full message
        send(sockfd, fullmsg, strlen(fullmsg), 0);
      }
    }

    for (i = 0; i < MAXCLIENTS; i++) {
      if (g.conn[i].status == Pending) {
        //    printf("Pending %d : %s\n", i, g.conn[i].message);
        for (int j = 0; j < MAXCLIENTS; j++) {
          //    printf("%d %d \n", g.conn[j].status, j);
          if (j != i && g.conn[j].status != Unconnected) {
            write(g.conn[j].sockfd, g.conn[i].message,
                  strlen(g.conn[i].message));
          }
        }
        g.conn[i].status = Delivered;
      }
    }

    pwait();
  }

  // got EOF from monitor, shut it down

  if (monitor->status == EndOfFile) {
    if (close(sockfd) == -1) {
      perror("close");
    }
  }

  for (i = 0; i < MAXCLIENTS; i++) {
    g.conn[i].status = EndOfFile;
  }

  // cleanup -- leave here
  for (i = 0; i < MAXCLIENTS; i++) {
    pthread_join(g.conn[i].tid, NULL);
    pthread_mutex_destroy(&g.conn[i].mutex);
  }
}

/**
 * server_chat - thread handler for a client connection
 *
 * @param arg - the conn_t structure for this client thread to use
 * @returns NULL
 */
void *server_chat(void *arg) {
  conn_t *conn = (conn_t *)arg;
  int eof = 0;
  char buf[BUFSIZE];
  int n;

  if (g.verbose)
    printf("sthread[%d]: starting server thread\n", conn->id);

  while (!eof) {

    // implement me
    memset(buf, 0, BUFSIZE);
    n = read(conn->sockfd, buf, BUFSIZE);
    // printf("Message %s", buf);
    if (n == -1) {
      if (errno != EAGAIN) {
        perror("server_chat");
      }
    } else {
      if (conn->status == Delivered) {
        if (n > 0) {
          //    printf("Put message\n");
          pthread_mutex_lock(&conn->mutex);
          strcpy(conn->message, buf);
          conn->msgsize = n;
          conn->status = Pending;
          pthread_mutex_unlock(&conn->mutex);
        } else if (n == 0) {
          conn->status = EndOfFile;
          break;
        }
      }
    }
    if (conn->status == EndOfFile) {
      close(conn->sockfd);
      pthread_mutex_unlock(&conn->mutex);
      return NULL;
    }

    pwait();
  }

  if (g.verbose) {
    printf("sthread[%d]: terminating\n", conn->id);
  }

  return NULL;
}

/**
 * monitor_chat - thread handler for a monitor connection
 *
 * @param arg - the conn_t structure for monitor thread to use
 * @returns NULL
 */
void *monitor_chat(void *arg) {
  conn_t *conn = (conn_t *)arg;
  int eof = 0;
  int sockfd = conn->sockfd;
  int n;
  char buf[BUFSIZE];
  nonblock(STDIN_FILENO);

  if (g.verbose)
    printf("monitor: starting\n");

  while (!eof) {

    // implement me

    n = read(STDOUT_FILENO, buf, BUFSIZE);
    if (n == -1) {
      if (errno != EAGAIN) {
        perror("monitor_chat");
      }
    } else {
      if (conn->status != Pending) {
        if (n > 0) {
          pthread_mutex_lock(&conn->mutex);
          // printf("Putting message from server: %s\n", buf);
          strcpy(conn->message, buf);
          conn->msgsize = n;
          conn->status = Pending;
          pthread_mutex_unlock(&conn->mutex);
        } else if (n == 0) {
          conn->status = EndOfFile;
          break;
        }
      }
    }

    pwait();
  }

  if (g.verbose)
    printf("monitor: exiting\n");
  return NULL;
}

int main(int argc, char **argv) {
  int c = -1, sockfd;
  char *portstr = "5000";
  char *hoststr = "localhost";

  setbuf(stdout, NULL);

  // initialize global data structure
  memset(&g, 0, sizeof(g));
  g.portstr = portstr;
  g.hoststr = hoststr;
  g.mode = Server;

  // longer delay, easier debugging
  // shorter delay, faster response time
  g.timeout = 2000; // in milliseconds

  while ((c = getopt(argc, argv, "ch:p:t:v")) != -1) {
    switch (c) {
    case 'c':
      g.mode = Client;
      break;
    case 'h':
      g.hoststr = optarg;
      break;
    case 'p':
      g.portstr = optarg;
      break;
    case 't':
      g.timeout = atoi(optarg);
      break;
    case 'v':
      g.verbose = 1;
      break;
    }
  }

  if (g.mode == Client) {
    sockfd = client_setup();
    client_chat(sockfd);
  } else {
    sockfd = server_setup();
    nonblock(sockfd); // listen socket is non-blocking

    // spawn monitor thread
    g.conn[0].status = Delivered; // claim connection 0
    g.conn[0].sockfd = STDOUT_FILENO;
    g.conn[0].id = 0;
    pthread_mutex_init(&g.conn[0].mutex, NULL);
    pthread_create(&g.conn[0].tid, NULL, monitor_chat, &g.conn[0]);

    // invoke relay
    relay(sockfd);

    // after relay exits, ensure monitor terminates
    pthread_join(g.conn[0].tid, NULL);
  }

  return 0;
}
