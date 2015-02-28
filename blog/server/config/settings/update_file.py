# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import argparse
import utils


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--command")
    parser.add_argument("-p", "--path")
    parser.add_argument("-t", "--target")
    parser.add_argument("-v", "--value")
    parser.add_argument("-r", "--regex")
    parser.add_argument("-u", "--urlconf")
    args = parser.parse_args()

    if not args.command or not args.path or not args.target:
        raise Exception("One or more parameters are not specified")

    command = getattr(utils, args.command)\

    if not command:
        raise Exception("Command {command} not found".format(command=command))

    command(args)
