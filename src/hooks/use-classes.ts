import { useState, useMemo } from "react";

type Classes = string | string[];

interface UseClassesProps {
  fixedClasses?: Classes;
  initialClasses?: Classes;
}

export default function useClasses({
  fixedClasses = [],
  initialClasses = [],
}: UseClassesProps) {
  const [localClasses, setLocalClasses] = useState<Set<string>>(
    new Set(Array.isArray(initialClasses) ? initialClasses : initialClasses.split(' '))
  );

  const fixedClassesSet = useMemo(
    () => new Set(Array.isArray(fixedClasses) ? fixedClasses : fixedClasses.split(' ')),
    [fixedClasses]
  );

  const allClasses = useMemo(
    () => Array.from(new Set([...fixedClassesSet, ...localClasses])).join(' '),
    [localClasses, fixedClassesSet]
  );

  const setClasses = (classes: Classes) => {
    const classArray = Array.isArray(classes) ? classes : classes.split(' ');
    setLocalClasses(new Set(classArray));
  };

  const addClasses = (classes: Classes) => {
    const classesToAdd = Array.isArray(classes) ? classes : classes.split(' ');
    setLocalClasses(prev => new Set([...prev, ...classesToAdd]));
  };

  const deleteClasses = (classes: Classes) => {
    const classesToRemove = new Set(Array.isArray(classes) ? classes : classes.split(' '));
    setLocalClasses(prev => {
      const updated = new Set(prev);
      classesToRemove.forEach(cls => updated.delete(cls));
      return new Set([...prev].filter(cls => !classesToRemove.has(cls)));
    });
  };

  const toggleClasses = (classes: Classes) => {
    const classesToToggle = Array.isArray(classes) ? classes : classes.split(' ');
    setLocalClasses(prev => {
      const updatedSet = new Set(prev);
      classesToToggle.forEach(cls => {
        if (updatedSet.has(cls)) updatedSet.delete(cls);
        else updatedSet.add(cls);
      });
      return updatedSet;
    });
  };

  const classes = useMemo(
    () => [...fixedClassesSet, ...localClasses].join(' '),
    [fixedClassesSet, localClasses]
  );

  return {
    classes: allClasses,
    setClasses,
    addClasses,
    deleteClasses,
    toggleClasses,
  };
}
