# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from funcy import first
import meta
import ast


__all__ = ['add_str_to_tuple', 'add_url_to_patterns']


def add_url_to_patterns(options):
    """
    Getting file from `path` param and append to `target` variable
    new url with regex and include. After file be overriding.
    """

    class AddStrToTuple(ast.NodeTransformer):
        def visit_Assign(self, node):
            if first(node.targets).id == options.target and not hasattr(self, '_not_set'):
                ast_include = ast.Call(
                    func=ast.Name(id='include'),
                    args=[ast.Str(s=options.urlconf)],
                    keywords=[],
                    starargs=None,
                    kwargs=None)

                ast_url = ast.Call(
                    func=ast.Name(id='url'),
                    args=[ast.Str(s=options.regex), ast_include],
                    keywords=[],
                    starargs=None,
                    kwargs=None)

                node.value.args.append(ast_url)

                self._not_set = True

            return node

    with open(options.path, 'r') as mr:
        module_content = mr.read()
        ast_module = ast.parse(module_content)

        updated_tree = AddStrToTuple().visit(ast_module)

        ast.fix_missing_locations(updated_tree)

        backward_source_code = meta\
            .dump_python_source(updated_tree)

    with open(options.path, 'w') as mw:
        mw.write(backward_source_code)

    print "File update successfully"


def add_str_to_tuple(options):
    """
    Getting file from `path` param and append to `target` list
    or tuple new `value`. After tuple be changed file be overriding.
    """

    class AddStrToTuple(ast.NodeTransformer):
        def visit_Assign(self, node):
            for tg in node.targets:
                if tg.id == options.target:
                    node.value.elts\
                        .append(ast.Str(s=options.value))
            return node

    with open(options.path, 'r') as mr:
        module_content = mr.read()
        ast_module = ast.parse(module_content)

        updated_tree = AddStrToTuple().visit(ast_module)

        ast.fix_missing_locations(updated_tree)

        backward_source_code = meta\
            .dump_python_source(updated_tree)

    with open(options.path, 'w') as mw:
        mw.write(backward_source_code)

    print "File update successfully"
