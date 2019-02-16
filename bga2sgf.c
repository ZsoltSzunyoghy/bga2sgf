#ifdef _MSC_VER
#define _CRT_SECURE_NO_WARNINGS
#endif

#include <stdio.h>
#include <string.h>


/*
Create SGF file based on BGA go game record extracted by Ctrl-A + Ctrl-C

name of the input file must be passed as first parameter

todo: add stdin handling
todo: output file handling
todo: specifying the scoring method should be possible somehow
todo: what if there is both komi and handicap

online SGF file validator:
https://www.red-bean.com/sgf/sgfc/munch.html

by default 13x13 board but converted to 19x19 when a stone is played outside of 13x13
by default Japanese rules because the scoring method is not included on the BGA game page

*/

int boardsize = 13;

char *sgfrows = "abcdefghijklmnopqrstuvwxy";

char mapcol(char *col) {
	char *a = "ABCDEFGHJKLMNOPQRST";
	char *ptr;
	if((ptr = strstr(a, col)) == NULL) {
		return 'x';
	} 

	return sgfrows[ptr - a];
}

char maprow(char *row) {
	
	int index = atoi(row);
	return sgfrows[boardsize - index];
}

void main()
{
	FILE *fp;
	char str[1280];
	char white[50];
	char black[50];
	int komi;
	int handicap = 0;
	char handicapstones[100];
	char moves[200][50];
	int moveindex = 0;
	//char * pch;

	/* opening file for reading */
	fp = fopen("input.txt", "r");
	if (fp == NULL) {
		printf("Error opening file");
		return(-1);
	}

	while (fgets(str, 500, fp) != NULL) {
		/*
		pch = strtok(str, ";");
		while (pch != NULL)
		{
			printf("%s\n", pch);
			pch = strtok(NULL, ";");
		}*/

		
		if (strstr(str, "plays") != NULL) {
			//printf("%s", str);
			strcpy(moves[moveindex++], str);
			if (strstr(str, "plays (O") != NULL) {
				boardsize = 19;
			}

		} else if (strstr(str, "handicap") != NULL) {
			strcpy(moves[moveindex++], str);

			/* Handicap line looks like this:
			   "2 have been placed on the board as the handicap for szunyi (D, 4)(K, 10)."
			*/

			// find out handicap
			char *h;
			h = strtok(str, " ");
			handicap = atoi(h);

			// find out who is black by handicap: skip the first 11 words
			char *b;
			for (int i = 1;i <= 11;i++) {
				b = strtok(NULL, " ");
			}			
			
			strcpy(black, b);

			//parse handicap stones:
			char *c, *r;
			//printf("\nhandicap stones: %s\n", b);
			int pos = 0;
			for (int i = 1; i <= handicap; i++) {
				c = strtok(NULL, "(,)");
				r = strtok(NULL, "(,)");
				pos = snprintf(handicapstones + pos, 10, "[%c%c]", mapcol(c), maprow(r));
			}
			//printf("handicapstones: %s\n", handicapstones);


			// find out who is white by the first move
			char w[128];
			char *ww;
			strcpy(w, moves[moveindex - 2]);
			ww = strtok(w, " ");
			strcpy(white, w);


		} else if ((strstr(str, "gains") != NULL) && (strstr(str, "komi") != NULL)) {

			/* Komi line looks like this:
				"szunyi gains 5 points for komi."
			*/

			// find out who is white by komi entry
			strcpy(moves[moveindex++], str);
			char *w;
			w = strtok(str, " ");
			strcpy(white, w);
			
			// find out komi
			char *k;
			k = strtok(NULL, " ");
			k = strtok(NULL, " ");

			komi = atoi(k);

			// find out who is black by the first move
			char b[128];
			char *bb;
			strcpy(b, moves[moveindex - 2]);
			bb = strtok(b, " ");
			strcpy(black, b);
				
		} else if (strstr(str, "captures") != NULL) {
			//printf("%s", str);
			strcpy(moves[moveindex++], str);
		}
		else if (strstr(str, "passes") != NULL) {
			//printf("%s", str);
			strcpy(moves[moveindex++], str);
		}
	}
	fclose(fp);

	//printf("EOF");





	//printf("\nWhite is: %s", white);
	//printf("\nBlack is: %s\n", black);
	//printf("\nBoarsize is: %d\n", boardsize);


	if (handicap > 0) {
		printf("(;GM[1]FF[4]CA[UTF-8]AP[bga2sgf:1]ST[2]RU[Japanese]SZ[%d]HA[%d]AB%sPW[%s]PB[%s]", boardsize, handicap, handicapstones, white, black);
	} else {
		printf("(;GM[1]FF[4]CA[UTF-8]AP[bga2sgf:1]ST[2]RU[Japanese]SZ[%d]KM[%d.00]PW[%s]PB[%s]", boardsize, komi, white, black);
	}


	char *r, *c, *m, *p;

	for (int i = moveindex-1; i >= 0; i--)
	{
		m = moves[i];
		if (strstr(m, "plays") != NULL) {

			//printf("\nLINE: %s", m);

			c = strtok(m, "(,)");
			c = strtok(NULL, "(,)");
			r = strtok(NULL, "(,)");

			//printf("inspecting: <%s,%s>\n", c, r);

			if (strstr(m, white) != NULL) {
				printf(";W[%c%c]", mapcol(c), maprow(r));
			} else if (strstr(m, black) != NULL) {
				printf(";B[%c%c]", mapcol(c), maprow(r));
			}
		}
		else if (strstr(m, "passes") != NULL) {
			p = strtok(m, " ");
			if (strstr(p, white) != NULL) {
				printf(";W[]");
			}
			else if (strstr(p, black) != NULL) {
				printf(";B[]");
			}
		}
		//printf("%s", m);
		
	}

	printf(")");
return(0);
}