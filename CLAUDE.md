# Notes related to lazyDom

Start out by reading these files:

 * @README.md
 * @ARCHITECTURE.md

If you need to work on a improving performance, also read
@PERFORMANCE_ANALYSIS.md.

# Additional instructions
 * Tasks are not done unless tests, typecheck and linting all passes.
 * Remember to use the thunk approach for all calls that mutate data, since
   this is the main idea with lazyDom. Use the storage classes and create
   new ones where appropriate.
 * Avoid type assertions and ask for permisison to use them if everything
   else fails. In stead, look up and use the correct types to use, so the
   type system can be actively used to verify whether the implementation is
   correct.

