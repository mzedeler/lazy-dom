import { Bench } from 'tinybench'

// The purpose of this file is to benchmark different store approaches
// against each other

import { NaiveConsumer } from './NaiveConsumer'
import { ResetNaiveConsumer } from './ResetNaiveConsumer'
import { Consumer } from './Consumer'

const bench = new Bench({ time: 100 })

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

const addNewSet2Get1000Case = (bench: Bench, ConsumerClass: new() => Consumer) => {
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

addNewSetGetCase(bench, NaiveConsumer)
addNewSetGetCase(bench, ResetNaiveConsumer)
addNewSetGet1000Case(bench, NaiveConsumer)
addNewSetGet1000Case(bench, ResetNaiveConsumer)
addNewSet10Get1000Case(bench, NaiveConsumer)
addNewSet10Get1000Case(bench, ResetNaiveConsumer)
addNewSet2Get1000Case(bench, NaiveConsumer)
addNewSet2Get1000Case(bench, ResetNaiveConsumer)

const main = async () => {
  await bench.warmup()
  await bench.run()
  console.table(bench.table())
}

main()
