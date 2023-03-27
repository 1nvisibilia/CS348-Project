use MySchedule;


DELIMITER $$
CREATE TRIGGER cap_decr_delete
AFTER DELETE ON Attends
FOR EACH ROW
BEGIN
	UPDATE Component
    SET enrolltot = enrolltot-1
    WHERE id = OLD.cid;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER cap_decr_update
AFTER UPDATE ON Attends
FOR EACH ROW
BEGIN
	UPDATE Component
    SET enrolltot = enrolltot-1
    WHERE id = OLD.cid;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER cap_incr_insert
BEFORE INSERT ON Attends
FOR EACH ROW
BEGIN
	 IF EXISTS (
		SELECT * FROM Component
        WHERE Component.id = NEW.cid
        AND Component.enrolltot >= Component.enrollcap
	)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insert not allowed. Component already at full capacity.';
	ELSE
		UPDATE Component
		SET enrolltot = enrolltot+1
		WHERE id = NEW.cid;
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER cap_incr_update
BEFORE UPDATE ON Attends
FOR EACH ROW
BEGIN
	IF EXISTS (
		SELECT * FROM Component
        WHERE Component.id = NEW.cid
        AND Component.enrolltot >= Component.enrollcap
	)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update not allowed. Component already at full capacity.';
	ELSE
		UPDATE Component
		SET enrolltot = enrolltot+1
		WHERE id = NEW.cid;
	END IF;
END$$
DELIMITER ;

