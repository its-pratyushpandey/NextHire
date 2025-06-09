/**
 * Determines whether a given range overlaps with another range.
 *
 * @since 9.2.2
 * @group Utilities
 */
export declare function rangeOverlaps(rangeLeft: {
    from: Date;
    to: Date;
}, rangeRight: {
    from: Date;
    to: Date;
}, dateLib?: import("../classes/DateLib.js").DateLib): boolean;
