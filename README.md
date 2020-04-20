# bga2sgf

# prerequisits
This script needs Violentmonkey extension, please install it as explained here:
https://violentmonkey.github.io/get-it/

Your language is set to English in BGA

# installation
Copy and paste violentmonkey-script.js as a new script into Violentmonkey editor and set the @match value under the settings according to violentmonkey-script-settings.txt

Do the same with the violentmonkey-script-closedgames.js. Please add it to a different script in Violentmonkey and set the respective @match value from the same violentmonkey-script-settings.txt.

There is two version for the script. One script can extract the SGF for an ongoing game, the other can extract SGF after the game was finished.

Enable both scripts in Violentmonkey

# how to use
Open your go game on BGA.

Refresh the page if the button "Show SGF" did not appear.

Press the "Show SGF" button and then copy and paste the shown SGF into a test file. You can use triple click inside the alert popup. I suggest using extention .sgf

# known issues
1. The script is extracting the SGF based on the logs so you can use it only on a page where the game log is visible in some format, e.g. replay page for the closed games
2. BGA developers sometimes change the wording in the log panel and that breaks this script. Contact me in such a case do that I can adjust the script.
3. Since log does not contain the board size, the script will assume 13x13 board until somebody plays in column "O"
4. Since the log does not contain the ruleset, the script will assume Japanese rules.
5. The pushbutton appears also on other pages. Workaround: you can switch on/off the script easily in Violentmonkey and refresh the page.


# features to be implemented
Save with more meaningful filename

Make one script from the two and choose automatically

Enable the user to choose/confirm board size and ruleset
