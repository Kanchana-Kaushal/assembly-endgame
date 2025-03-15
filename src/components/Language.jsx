function LanguageElements(props) {
  function LoadLanguages() {
    return props.languages.map((language, index) => {
      const isLangDead = index < props.wrongGuessCount;

      const styles = {
        backgroundColor: language.backgroundColor,
        color: language.color,
      };

      return (
        <div className="relative" key={language.name}>
          <span
            style={styles}
            className={`rounded-sm px-2 py-1 text-xs font-semibold ${isLangDead ? "mix-blend-overlay" : ""}`}
          >
            {language.name}
          </span>

          {isLangDead ? (
            <span className="absolute inset-0 flex items-center justify-center text-xs">
              💀
            </span>
          ) : null}
        </div>
      );
    });
  }

  return (
    <section className="flex flex-wrap items-center justify-center gap-2">
      <LoadLanguages />
    </section>
  );
}

export default LanguageElements;
