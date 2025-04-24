#pragma once


#define MAXLINE 1024

/* define special characters (non-printables that control behavior) */
#define BKSPACE 0x7F
#define CTRL_D  0x04
#define CTRL_N  0x0E
#define CTRL_P  0x10
#define CTRL_R  0x12
#define ENTER   0x0A
#define ESC     0x1B

typedef unsigned int input_options_t;

typedef enum {
  COMMAND,
  SEARCH
} input_mode_t;

typedef struct {
  char control_seq;
  char line[MAXLINE];
  int pos;
  input_mode_t mode;
  input_options_t opts;
} input_t;

void config_term();
void restore_term();

void init_input(input_t *input);
int  get_input(input_t *input, int len);
int  update_input_mode(input_t *input);

void reset_line(input_t *input);
void clear_prompt(input_t *in, int len);
