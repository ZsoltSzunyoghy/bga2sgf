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
1. The script is extracting the SGF based on the logs so you can use it only on a page where the game log is visible in some format
2. Both versions use the same button.
3. The pushbutton appears also on other pages


# features to be implemented
Construct the SGF file so that it can be directly downloaded using the pushbutton.

Make one script from the two and choose automatically
