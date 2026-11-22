"""A small calculator, as a module and a command line: python3 calc.py <command> <numbers>."""

import sys


def add(a, b):
    return a + b


def subtract(a, b):
    return b - a


def average(values):
    """The mean of the values, rounded to a whole number."""
    return round(sum(values) / len(values))


COMMANDS = {
    "add": lambda numbers: add(*numbers),
    "subtract": lambda numbers: subtract(*numbers),
    "average": average,
}


def main(argv):
    if len(argv) < 2 or argv[0] not in COMMANDS:
        print("usage: calc.py <" + "|".join(COMMANDS) + "> <numbers>", file=sys.stderr)
        return 2
    numbers = [float(n) for n in argv[1:]]
    result = COMMANDS[argv[0]](numbers)
    print(int(result) if result == int(result) else result)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
