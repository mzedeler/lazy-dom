import { Bench } from 'tinybench'

// The purpose of this file is to benchmark different store approaches
// against each other

import { NaiveConsumer } from './NaiveConsumer'
import { ResetNaiveConsumer } from './ResetNaiveConsumer'
import { Consumer } from './Consumer'
import { QueueLengthConsumer } from './QueueLengthConsumer'
import { DirtyNaiveConsumer } from './DirtyNaiveConsumer'

const bench = new Bench({ time: 100 })

type AddCaseSignature = (bench: Bench, ConsumerClass: new() => Consumer) => void

const addNewSetGetCase = (bench: Bench, ConsumerClass: new() => Consumer) => {
  bench.add(`addNewSetGetCase: ${ConsumerClass.prototype.constructor.name}`, () => {
    const consumer = new ConsumerClass()
    consumer.setValue('foo', 'bar')
    consumer.getValue('foo')
  })
}

const addNewSetGet1000Case = (bench: Bench, ConsumerClass: new() => Consumer) => {
  bench.add(`addNewSetGet1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
    const consumer = new ConsumerClass()
    consumer.setValue('foo', 'bar')
    for (let i = 0; i < 1000; i++) {
      consumer.getValue('foo')
    }
  })
}

const addNewSet10Get1000Case = (bench: Bench, ConsumerClass: new() => Consumer) => {
  bench.add(`addNewSet10Get1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
    const consumer = new ConsumerClass()
    for (let i = 0; i < 10; i++) {
      consumer.setValue('foo' + i, '' + i)
    }

    consumer.setValue('foo', 'bar')
    for (let i = 0; i < 1000; i++) {
      consumer.getValue('foo1')
    }
  })
}

const addNewSet2Get1000Case: AddCaseSignature = (bench, ConsumerClass) => {
  bench.add(`addNewSet2Get1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
    const consumer = new ConsumerClass()
    for (let i = 0; i < 2; i++) {
      consumer.setValue('foo' + i, '' + i)
    }

    consumer.setValue('foo', 'bar')
    for (let i = 0; i < 1000; i++) {
      consumer.getValue('foo')
    }
  })
}


const addCase = (addCaseCallback: AddCaseSignature) => {
  addCaseCallback(bench, NaiveConsumer)
  addCaseCallback(bench, ResetNaiveConsumer)
  addCaseCallback(bench, QueueLengthConsumer)
  addCaseCallback(bench, DirtyNaiveConsumer)
}

addCase(addNewSetGetCase)
addCase(addNewSetGet1000Case)
addCase(addNewSet10Get1000Case)
addCase(addNewSet2Get1000Case)

const main = async () => {
  await bench.warmup()
  await bench.run()
  console.table(bench.table())
}

main()
