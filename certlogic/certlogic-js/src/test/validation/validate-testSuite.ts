/*
 * Validates the CertLogic expressions in the test suite in the CertLogic specification using the validator of the Type-/JavaScript implementation of CertLogic.
 */

import { join } from "path"
import { readdirSync, readFileSync } from "fs"

import { validate } from "../../validation"


const testSuitesPath = join(__dirname, "../../../../specification/testSuite")


describe("test suites", () => {
    readdirSync(testSuitesPath)
        .filter((path) => path.endsWith(".json"))
        .map((path) => JSON.parse(readFileSync(join(testSuitesPath, path), "utf8")))
        .forEach((testSuite) => {
            it(`should validate test suite "${testSuite.name}"...`, () => {
                testSuite.cases.forEach((testCase: any) => {
                    const validateAndReport = (testExpr: any, index?: number) => {
                        const errors = validate(testExpr)
                        if (errors.length > 0) {
                            console.log(`${errors.length} validation error${errors.length > 1 ? "s" : ""} found on expression of ${index === undefined ? "" : `assertion #${index + 1} of`} test case "${testCase.name}" in test suite "${testSuite.name}":`)
                            errors.forEach(({ message, expr }) => {
                                console.log(`\t${message} on (sub) expression:`)
                                console.dir(expr)
                            })
                        }
                    }
                    if (testCase.certLogicExpression !== undefined) {
                        validateAndReport(testCase.certLogicExpression)
                    }
                    testCase.assertions
                        .forEach((assertion: any, index: number) => {
                            if (assertion.certLogicExpression !== undefined) {
                                validateAndReport(assertion.certLogicExpression, index)
                            }
                        })
                })
            })
        })
})

