CC=gcc
CFLAGS=-g -Wall -Wno-unused-parameter -Werror
OBJS=node.o history.o
DRIVER=run.o
LIB=shell.a

all: run test 

run: $(DRIVER) $(OBJS)
	$(CC) -o $@ $^ $(LIB)

test: $(OBJS)
	$(CC) -o $@ $^ $(LIB)

clean:
	rm -f run test *.o
