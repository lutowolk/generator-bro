# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import argparse
import meta
import ast


def add_str_to_tuple(target, value, path):
    """
    Getting file from `path` param and append to `target` list
    or tuple new `value`. After tuple be changed file be override.

    Usage:

    >>> add_str_to_tuple('a', '10', './test.py')

    :param target: basestring
    :param value: basestring
    :param path: basestring
    :return: None
    """
    class AddStrToTuple(ast.NodeTransformer):
        def visit_Assign(self, node):
            for tg in node.targets:
                if tg.id == target:
                    node.value.elts\
                        .append(ast.Str(s=value))
            return node

    with open(path, 'r') as mr:
        module_content = mr.read()
        ast_module = ast.parse(module_content)

        updated_tree = AddStrToTuple().visit(ast_module)

        ast.fix_missing_locations(updated_tree)

        backward_source_code = meta\
            .dump_python_source(updated_tree)

    with open(path, 'w') as mw:
        mw.write(backward_source_code)

    print "File update successfully"


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--path")
    parser.add_argument("-t", "--target")
    parser.add_argument("-v", "--value")
    args = parser.parse_args()

    if not args.path or not args.target or not args.value:
        raise Exception("One or more parameters are not specified")

    add_str_to_tuple(args.target, args.value, args.path)
