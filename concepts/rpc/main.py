#! /bin/python

import argparse

parser = argparse.ArgumentParser()
parser.add_argument('first_number', type=int)
parser.add_argument('second_number', type=int)
args = parser.parse_args()



def multiply(x, y):
    return x * y


def main():
    first = args.first_number
    second = args.second_number
    print(f'Primeiro argumento {first}')
    print(f'Segundo argmumento {second}')
    print(multiply(first,second))

main()