"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tinybench_1 = require("tinybench");
const lodash_es_1 = require("lodash-es");
// The purpose of this file is to benchmark different store approaches
// against each other
const NaiveConsumer_1 = require("./NaiveConsumer");
const ResetNaiveConsumer_1 = require("./ResetNaiveConsumer");
const QueueLengthConsumer_1 = require("./QueueLengthConsumer");
const DirtyNaiveConsumer_1 = require("./DirtyNaiveConsumer");
const bench = new tinybench_1.Bench({ time: 100 });
const addNewSetGetCase = (bench, ConsumerClass) => {
    bench.add(`addNewSetGetCase: ${ConsumerClass.prototype.constructor.name}`, () => {
        const consumer = new ConsumerClass();
        consumer.setValue('foo', 'bar');
        consumer.getValue('foo');
    });
};
const addNewSetGet1000Case = (bench, ConsumerClass) => {
    bench.add(`addNewSetGet1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
        const consumer = new ConsumerClass();
        consumer.setValue('foo', 'bar');
        for (let i = 0; i < 1000; i++) {
            consumer.getValue('foo');
        }
    });
};
const addNewSet10Get1000Case = (bench, ConsumerClass) => {
    bench.add(`addNewSet10Get1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
        const consumer = new ConsumerClass();
        for (let i = 0; i < 10; i++) {
            consumer.setValue('foo' + i, '' + i);
        }
        consumer.setValue('foo', 'bar');
        for (let i = 0; i < 1000; i++) {
            consumer.getValue('foo1');
        }
    });
};
const addNewSet2Get1000Case = (bench, ConsumerClass) => {
    bench.add(`addNewSet2Get1000Case: ${ConsumerClass.prototype.constructor.name}`, () => {
        const consumer = new ConsumerClass();
        for (let i = 0; i < 2; i++) {
            consumer.setValue('foo' + i, '' + i);
        }
        consumer.setValue('foo', 'bar');
        for (let i = 0; i < 1000; i++) {
            consumer.getValue('foo');
        }
    });
};
const addCase = (addCaseCallback) => {
    addCaseCallback(bench, NaiveConsumer_1.NaiveConsumer);
    addCaseCallback(bench, ResetNaiveConsumer_1.ResetNaiveConsumer);
    addCaseCallback(bench, QueueLengthConsumer_1.QueueLengthConsumer);
    addCaseCallback(bench, DirtyNaiveConsumer_1.DirtyNaiveConsumer);
};
addCase(addNewSetGetCase);
addCase(addNewSetGet1000Case);
addCase(addNewSet10Get1000Case);
addCase(addNewSet2Get1000Case);
const main = async () => {
    await bench.warmup();
    await bench.run();
    const splitTaskName = (entry) => {
        console.log({ entry });
        const { 'Task Name': taskName, ...rest } = entry;
        const [task, consumer] = taskName.split(': ');
        return { task, consumer, ...rest };
    };
    const aggregate = (entries) => ({
        maxTime: (0, lodash_es_1.maxBy)(entries, 'Average Time (ns)'),
        minTime: (0, lodash_es_1.minBy)(entries, 'Average Time (ns)'),
    });
    const tasks = (0, lodash_es_1.groupBy)((0, lodash_es_1.mapValues)(bench.table(), splitTaskName), 'task');
    const aggregates = (0, lodash_es_1.mapValues)(tasks, aggregate);
    const relativeTime = (key, entry) => Number((100 * entry['Average Time (ns)'] / aggregates[key].maxTime['Average Time (ns)']).toFixed(2));
    const relativeTasks = Object.keys(tasks).map(key => (0, lodash_es_1.sortBy)(tasks[key].map(entry => ({
        'Relative Time (%)': relativeTime(key, entry),
        ...entry
    })), 'Relative Time (%)'));
    Object.keys(relativeTasks).forEach(key => {
        console.table(relativeTasks[key]);
    });
};
main();
