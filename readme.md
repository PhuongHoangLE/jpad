# jPad

This is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown.

-   Click any text cell to edit it
-   The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!
-   You can show any React component, string, number, or anything else by calling the `show` function. This is a function built into this environment. Call show multiple times to show multiple values.
-   Re-order or delete cells using the buttons on the top right
-   Add new cells by hovering on the divider between each cell

All of your changes get saved to the file you opened jPad with. So if you ran `npx jpad serve pad.js`, all of the text and code you write will be saved to the `pad.js` file.
