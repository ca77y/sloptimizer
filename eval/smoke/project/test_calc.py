import unittest

from calc import add, average, main


class AddTest(unittest.TestCase):
    def test_small(self):
        self.assertEqual(add(2, 2), 4)


class AverageTest(unittest.TestCase):
    def test_whole(self):
        self.assertEqual(average([2, 4]), 3)


class CommandLineTest(unittest.TestCase):
    def test_unknown_command(self):
        self.assertEqual(main(["frobnicate", "1"]), 2)


if __name__ == "__main__":
    unittest.main()
