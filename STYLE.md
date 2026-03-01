# Code style guide
 * Remember to use the thunk approach for all calls that mutate data, since
   this is the main idea with lazyDom. Use the storage classes and create
   new ones where appropriate.
 * Use TypeScript to prevent bugs by using as specific and correct types as
   possible:
   * Avoid type assertions like `const foo = bar as baz`.
   * Avoid using `any` over the type actually used.
 * Co-locate test files with their classes. A test for `Foo.ts` should be
   named `Foo.test.ts` and placed in the same directory.
