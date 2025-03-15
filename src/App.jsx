import { languages } from "../languages";
import { getFarewellText, getRandomWord } from "../utils";
import LanguageElements from "./components/Language";
import { useState } from "react";
import Confetti from "react-confetti";

function App() {
  //State Values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedWord, setGuessedWord] = useState([]);

  //Derived from states
  const wrongGuessCount = guessedWord.filter(
    (letter) => !currentWord.includes(letter),
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedWord.includes(letter));

  const isGamelost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGamelost || isGameWon;
  const lastGuessedLetter = guessedWord[guessedWord.length - 1];

  const isLastLetterWrong =
    lastGuessedLetter && !currentWord.split("").includes(lastGuessedLetter);

  //hard coded values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function guessAttempt(letter) {
    setGuessedWord((prev) =>
      prev.includes(letter) ? prev : [...prev, letter],
    );
  }

  //this will load letter boxes and check if it is guessed, if it is it will show the value. or else it will only display empty boxes
  const letterBoxes = currentWord.split("").map((letter, index) => {
    const isGuessed = guessedWord.includes(letter);

    if (isGameOver) {
      return (
        <span
          className={`flex size-10 items-center justify-center rounded-xs border-b-2 border-gray-400 bg-gray-700 uppercase shadow-lg ${!isGuessed && "opacity-40"}`}
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      );
    } else {
      return (
        <span
          className="flex size-10 items-center justify-center rounded-xs border-b-2 border-gray-400 bg-gray-700 uppercase shadow-lg"
          key={`${letter}-${index}`}
        >
          {isGuessed ? letter : ""}
        </span>
      );
    }
  });

  //This will load the alphabet buttons and updates their style according to the right and wrong letters
  const keys = alphabet.split("").map((letter) => {
    const isGuessed = guessedWord.includes(letter);
    const isRight = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    return (
      <button
        className={`size-10 cursor-pointer rounded-xs font-semibold text-black uppercase transition-all active:scale-95 ${isRight ? "bg-green-400" : isWrong ? "bg-red-400" : "bg-yellow-400"} disabled:opacity-60`}
        key={`${letter}`}
        disabled={isGameOver}
        onClick={() => guessAttempt(letter)}
        aria-disabled={guessedWord.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter}
      </button>
    );
  });

  function StatusElement() {
    if (isGameWon) {
      return (
        <section
          className="my-10 min-h-15 w-full rounded-sm bg-green-600 p-1 text-center"
          aria-live="polite"
          role="status"
        >
          <h2 className="font-bold">You Win!</h2>
          <p className="text-sm">"Good Work 😀🎉"</p>
        </section>
      );
    } else if (isGamelost) {
      return (
        <section
          className="my-10 min-h-15 w-full rounded-sm bg-red-600 p-1 text-center"
          aria-live="polite"
          role="status"
        >
          <h2 className="font-bold">Game Over!</h2>
          <p className="text-sm">
            You loose! Better start learning Assembly 😭
          </p>
        </section>
      );
    } else if (!isGameOver && isLastLetterWrong) {
      const farewellText = getFarewellText(languages[wrongGuessCount - 1].name);

      return (
        <section
          className="my-10 flex min-h-15 w-full items-center justify-center rounded-sm bg-blue-500 p-1 text-center"
          aria-live="polite"
          role="status"
        >
          <p className="text-sm">{farewellText}</p>
        </section>
      );
    } else {
      return <section className="my-10 min-h-15 w-full"></section>;
    }
  }

  function newGame() {
    setCurrentWord(getRandomWord());
    setGuessedWord([]);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <main className="max-w-3xl bg-gray-900 p-4 md:rounded-2xl lg:p-8">
        {isGameWon && (
          <Confetti
            recycle={false}
            numberOfPieces={1000}
            width={screen.width - 10}
            height={screen.height - 10}
          />
        )}
        <div className="mx-auto flex max-w-md flex-col items-center justify-center">
          <header className="text-center">
            <h1 className="text-xl font-bold">Assembly Endgame</h1>
            <p className="mt-2 text-sm text-gray-400">
              Guess the word within 8 attempts to keep the <br /> programming
              world safe from Assembly!
            </p>
          </header>

          <StatusElement />

          <LanguageElements
            languages={languages}
            wrongGuessCount={wrongGuessCount}
          />

          <section className="my-8 flex flex-wrap items-center justify-center gap-0.5">
            {letterBoxes}
          </section>

          {/* Combined visually-hidden aria-live region for status updates */}
          <section className="sr-only" aria-live="polite" role="status">
            <p>
              {currentWord.includes(lastGuessedLetter)
                ? `Correct! The letter ${lastGuessedLetter} is in the word.`
                : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
              You have {languages.length - 1 - wrongGuessCount} attempts left.
            </p>
            <p>
              Current word:
              {currentWord
                .split("")
                .map((letter) =>
                  guessedWord.includes(letter) ? letter + "." : "blank.",
                )
                .join(" ")}
            </p>
          </section>

          <section className="flex flex-wrap items-center justify-center gap-1">
            {keys}
          </section>

          {isGameOver ? (
            <button
              className="text-bold my-8 rounded-md bg-blue-600 px-3 py-1 hover:bg-blue-700 active:scale-95"
              onClick={newGame}
            >
              New Game
            </button>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
