import "should";
import { coerceNodeId } from "node-opcua-nodeid";
import { DataTypeFactory } from "../source/datatype_factory";

describe("DataTypeFactory", () => {
    it("DataTypeFactory", () => {
        const dataTypeFactory = new DataTypeFactory([]);
     //   dataTypeFactory.registerSimpleType("MyString", coerceNodeId("ns=1;i=1"));
    });

    it("should fallback to baseDataFactories in getConstructor", () => {
        const baseFactory = new DataTypeFactory([]);
        const derivedFactory = new DataTypeFactory([baseFactory]);
        const binaryEncodingNodeId = coerceNodeId("ns=1;i=6001");

        class DummyType {}
        const DummyTypeConstructor = DummyType as any;

        let baseFactoryWasQueried = false;
        (baseFactory as any).getConstructor = (nodeId: unknown) => {
            baseFactoryWasQueried = true;
            (nodeId as { toString(): string }).toString().should.eql(binaryEncodingNodeId.toString());
            return DummyTypeConstructor;
        };

        derivedFactory.getConstructor(binaryEncodingNodeId).should.eql(DummyTypeConstructor);
        baseFactoryWasQueried.should.eql(true);
    });
});
