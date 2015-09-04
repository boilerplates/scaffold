# Terminology and conventions

## Overview

This document describes the terminology and conventions used in this project, to help guide authors in creating effective, reusable scaffolds

<!-- toc -->

## What is a scaffold?

There are exceptions to every rule, but as a general rule of thumb effective scaffolds have the following attributes:

  1. **Temporary support structure** Scaffolds typically consist of one or more templates or source files that serve as a "temporary support structure". In contrast to [boilerplates][boilerplate], which are intended to be used to initialize a project _only_, a scaffold may be used at init, and/or throughout the duration of a project. 
  1. **Logically grouped files or templates** Scaffolds consist of one or more templates or source files. 
  1. **Generalized code and content.** When code is generalized, other code can be built on top of it to make it more specific. This doesn't mean "generic and boring", it just means that placeholders, templates or even code comments should be used wherever the user will need to make customizations.
  1. **Be specific.** Although the code and content of a scaffold should be generalized, the actual purpose and target audience for the scaffold should be as crystal-clear as possible. 

### Idiomatic scaffolds

If you'd like to go above and beyond in creating your scaffold, this section is for you. Here are some of the characteristics of an idiomatic scaffold:

  1. **Keep it simple.** With few exceptions, the more complicated the scaffold, the less likely it is to be useful to more developers. (_"simple" is not the same as "specific"_)
  1. **Well organized and documented.** Good documentation - and code comments when necessary - make it easier for build systems and generators to consume your scaffold as part of a larger build process. 
  1. **Customizable.** Use sensible defaults that can easily be overridden. This allows users to customize style, code and content based on a project-by-project basis. 
  1. **Discoverable.** Make it easy for other developers to find and use your scaffold. Read [more about discoverability](./authoring.md) 

## Reference

Here is a quick reference comparing the difference between boilerplates, scaffolds and templates.

| **type** | **description** |
| [template][] | Resuable file, code or content which contains "placeholder" values that will eventually be replaced with real values by a rendering (template) engine |
| [scaffold][] | Consist of one or more templates or source files and serve as a "temporary support structure" that may be used at init, or throughout the duration of a project. |
| [boilerplate][] | Boilerplates consist of all of the necessary files required to initialize a complete project. |


{%= reflinks(['boilerplate', 'scaffold', 'template']) %}
