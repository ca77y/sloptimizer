# calc.py for the whole team

Status: Todo
Labels: Feature
Priority: Medium

calc.py grows from a few arithmetic commands into the team's everyday calculator: unit conversions for the field team, a
saved history for the analysts, and a small HTTP service the dashboard can call.

## Why

The field team converts units by hand and gets it wrong; the analysts redo sums they ran yesterday; the dashboard
team wants results without shelling out to Python.

## Scope

- Unit conversions, `python3 calc.py convert <value> <from> <to>`, between metres, feet, kilometres and miles, between
  kilograms and pounds, and between Celsius and Fahrenheit.
- A history: every command-line result is saved to `~/.calc_history`, `python3 calc.py history` lists them, and
  `python3 calc.py history --clear` empties it.
- An HTTP service, `python3 calc.py serve --port <n>`, with `GET /add?a=&b=` and `GET /convert?value=&from=&to=`,
  answering JSON.

## Acceptance criteria

- `python3 calc.py convert 1 km m` prints 1000.
- `python3 calc.py convert 1 mi km` prints 1.60934, rounded to five decimals.
- `python3 calc.py convert 1 m ft` prints 3.28084, rounded to five decimals.
- `python3 calc.py convert 1 kg lb` prints 2.20462, rounded to five decimals.
- `python3 calc.py convert 100 C F` prints 212.
- `python3 calc.py convert 32 F C` prints 0.
- `python3 calc.py convert 1 kg m` exits 2 and says the units don't match.
- `python3 calc.py convert 1 parsec m` exits 2 and names the unknown unit.
- `python3 calc.py convert abc m ft` exits 2 and says the value isn't a number.
- `python3 calc.py add 2 3` prints 5.
- After `python3 calc.py add 2 3`, `python3 calc.py history` lists `add 2 3 = 5`.
- `history` lists results oldest first, one per line.
- `history` with no saved results prints nothing and exits 0.
- `history --clear` empties the history.
- History survives between runs.
- A history file that can't be read is reported, and the command still prints its result.
- `python3 calc.py serve --port 8765` answers `GET /add?a=2&b=3` with `{"result": 5}`.
- `GET /convert?value=1&from=km&to=m` answers `{"result": 1000}`.
- A missing or non-numeric parameter answers 400 with `{"error": "..."}` naming it.
- An unknown path answers 404.
- Mismatched units on `/convert` answer 400.
- The service logs one line per request.
- The service stops cleanly on Ctrl-C.
- `python3 calc.py --help` lists `add`, `convert`, `history` and `serve`.
