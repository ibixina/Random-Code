CC=clang
CFLAGS=-Wall -Werror -Wno-unused-parameter

all: strtok builtin concat locate argv shell

strtok: strtok.o
	$(CC) -o $@ $^

builtin: builtin.o
	$(CC) -o $@ $^

concat: concat.o
	$(CC) -o $@ $^

locate: locate.o
	$(CC) -o $@ $^

argv: argv.o
	$(CC) -o $@ $^

shell: shell.o
	$(CC) -o $@ $^

clean: neat
	rm -f strtok concat locate argv shell builtin

neat:
	rm -fr *.o *.dSYM
