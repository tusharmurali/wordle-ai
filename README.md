# wordle-ai
An AI for the daily word game Wordle. Check out the website [here](https://tusharmurali.github.io/wordle-ai/).

The AI can guess the WORDLE in an average of 3.42 turns, which was shown by [Alex Selby](http://sonorouschocolate.com/notes/index.php?title=The_best_strategies_for_Wordle) to be optimal.

The AI tries first to maximize the number of unique tile colorings that can be given for a guess, and second to minimize the variance of the number of possibilities that could remain after making the guess.